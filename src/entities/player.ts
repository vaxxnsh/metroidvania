import { KAPLAYCtx } from "kaplay";

export function makePlayer(k : KAPLAYCtx) {
  return k.make([
    k.pos(),
    k.area({ shape: new k.Rect(k.vec2(0, 16), 16, 16) }),
    k.anchor("center"),
    k.opacity(1),
    k.z(10),
    k.sprite("player"),
   
    k.body({ mass: 100,jumpForce : 320 }),
    {
      speed: 150,
      setPosition(x : number, y : number) {
        this.pos.x = x;
        this.pos.y = y;
      },
      setControls() {
        k.onKeyPress((key) => {
          if (key === "z" && this.isGrounded()) {
            if (this.curAnim() !== "jump") this.play("jump");
            this.jump();
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
        this.onFallOff(() => {
            this.play("fall");
        })

        this.onGround(() => {
            this.play("idle")
        })

        this.onHeadbutt(() => {
            this.play("fall");
        })
      }
    },
    "player"
  ]);
}