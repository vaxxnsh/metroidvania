import { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { state } from "../state/globalStateManager.js";

export function makeCartridge(k : KAPLAYCtx, pos : Vec2) {
  const cartridge = k.make([
    k.sprite("cartridge", { anim: "default" }),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
  ]);

  cartridge.onCollide("player", (player : GameObj) => {
    k.play("health", { volume: 0.5 });
    if (player.hp() < state.current().maxPlayerHp) {
      player.heal(1);
    }
    k.destroy(cartridge);
  });

  return cartridge;
}