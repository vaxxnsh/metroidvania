import { KAPLAYCtx } from "kaplay";
import { makeCartridge } from "../entities/healthCartridge.js";
import { makePlayer } from "../entities/player.js";
import { healthBar } from "../ui/healthBar.js";
import {
  setBackgroundColor,
  setMapColliders,
  setCameraZones,
  setExitZones,
  setCameraControls,
} from "./roomUtils.js";
import { roomData } from "./room1.js";

export function room2(k : KAPLAYCtx, roomData : roomData, previousSceneData = {exitName : null}) {
  setBackgroundColor(k, "#a2aed5");

  k.setCamScale(4);
  k.setCamPos(170, 100);
  k.setGravity(1000);

  const roomLayers = roomData.layers;
  const map = k.add([k.pos(0, 0), k.sprite("room2")]);

  const colliders = roomLayers[4].objects;
  setMapColliders(k, map, colliders);

  const player = k.add(makePlayer(k));

  setCameraControls(k, player, map, roomData);

  const positions = roomLayers[5].objects;
  for (const position of positions) {
    if (
      position.name === "entrance-1" &&
      previousSceneData.exitName === "exit-1"
    ) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
      continue;
    }

    if (
      position.name === "entrance-2" &&
      previousSceneData.exitName === "exit-2"
    ) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
      player.respawnIfOutOfBounds(1000, "room2", { exitName: "exit-2" });
      k.setCamPos(player.pos);
      continue;
    }

    if (position.type === "cartridge") {
      map.add(makeCartridge(k, k.vec2(position.x, position.y)));
    }
  }

  const cameras = roomLayers[6].objects;

  setCameraZones(k, map, cameras);

  const exits = roomLayers[7].objects;
  setExitZones(k, map, exits, "room1");

  healthBar.setEvents();
  healthBar.trigger("update");
  k.add(healthBar);
}
