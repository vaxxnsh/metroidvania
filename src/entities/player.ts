import { KAPLAYCtx } from "kaplay";
import { state, statePropsEnum } from "../state/globalStateManager";
import { makeBlink } from "./sharedLogic";
import { healthBar } from "../ui/healthBar";

export function makePlayer(k : KAPLAYCtx) {
  return k.make([
    k.pos(),
    k.area({ shape: new k.Rect(k.vec2(0, 16), 16, 16) }),
    k.anchor("center"),
    k.opacity(1),
    k.z(10),
    k.health(3,3),
    k.sprite("player"),
    k.doubleJump(state.current().doubleJumpEnabled ? 2 : 1),
    k.body({ mass: 100,jumpForce : 320 }),
    {
      speed: 150,
      setPosition(x : number, y : number) {
        this.pos.x = x;
        this.pos.y = y;
      },
      setControls() {
        k.onKeyPress((key) => {
          if (key === "z") {
            if (this.curAnim() !== "jump") this.play("jump");
            this.doubleJump();
          }

          if (
              key === "x" &&
              this.curAnim() !== "attack" &&
              this.isGrounded()
            ) {
              this.isAttacking = true;
              this.add([
                k.pos(this.flipX ? -25 : 0, 10),
                k.area({ shape: new k.Rect(k.vec2(0), 25, 10) }),
                "sword-hitbox",
              ]);
              this.play("attack");

              this.onAnimEnd((anim : string) => {
                if (anim === "attack") {
                  const swordHitbox = k.get("sword-hitbox", {
                    recursive: true,
                  })[0];
                  if (swordHitbox) k.destroy(swordHitbox);
                  this.isAttacking = false;
                  this.play("idle");
                }
              });
            }
        });

        k.onKeyDown((key) => {
          if (key === "left") {
            if (this.curAnim() !== "run") this.play("run");

            this.flipX = true;
            this.move(-this.speed, 0);
            return;
          }

          if (key === "right") {
            if (this.curAnim() !== "run") this.play("run");
            this.flipX = false;
            this.move(this.speed, 0);
            return;
          }
        });

        k.onKeyRelease(() => {
          if (this.curAnim() !== "idle" && this.curAnim() !== "jump")
            this.play("idle");
        });
      },
      enablePassthrough() {
        this.onBeforePhysicsResolve((collision) => {
          if (collision.target.is("passthrough") && this.isJumping()) {
            collision.preventResolution();
          }
        });
      },
      disableControls() {
        for (const handler of this.controlHandlers) {
            handler.cancel();
        }
      },
      respawnIfOutOfBounds(
        boundValue : number,
        destinationName : string,
        previousSceneData = { exitName: null }
      ) {
        k.onUpdate(() => {
          if (this.pos.y > boundValue) {
            k.go(destinationName, previousSceneData);
          }
        });
      },
      setEvents() {
        // when player falls after jumping
        this.onFall(() => {
          this.play("fall");
        });

        // when player falls off a platform
        this.onFallOff(() => {
          this.play("fall");
        });
        this.onGround(() => {
          this.play("idle");
        });
        this.onHeadbutt(() => {
          this.play("fall");
        });

        this.on("heal", () => {
          state.set(statePropsEnum.playerHp, this.hp());
          healthBar.trigger("update");
        });

        this.on("hurt", () => {
          makeBlink(k, this);
          if (this.hp() > 0) {
            state.set(statePropsEnum.playerHp, this.hp());
            healthBar.trigger("update");
            return;
          }

          state.set(statePropsEnum.playerHp, state.current().maxPlayerHp);
          k.play("boom");
          this.play("explode");
        });

        this.onAnimEnd((anim : string) => {
          if (anim === "explode") {
            k.go("room1");
          }
        });
      },
      enableDoubleJump() {
        this.numJumps = 2;
      },
    },
    "player"
  ]);
}