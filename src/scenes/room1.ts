import { KAPLAYCtx } from "kaplay";
import { setBackgroundColor, setCameraControls, setCameraZones, setExitZones, setMapColliders } from "./roomUtils";
import { makePlayer } from "../entities/player";
import { makeDrone } from "../entities/enemyDrone";
import { makeBoss } from "../entities/bossEnemy";
import { state } from "../state/globalStateManager";
import { makeCartridge } from "../entities/healthCartridge";
import { healthBar } from "../ui/healthBar";

export type roomData = {
    layers : {
        name : string
        objects : any
    }[]
}

export function room1(k : KAPLAYCtx,roomData : roomData,previousSceneData = { exitName: null }) {
    const layers = roomData.layers
    const colliders = []
    const positions = []
    const cameras = []
    const map = k.add([k.pos(),k.sprite("room1"),k.z(-10)])

    k.setCamScale(4)
    k.setCamPos(170,100)
    k.setGravity(1000)
    


    for (const layer of layers) {
        if (layer.name === "positions") {
            positions.push(...layer.objects);
        }

        if (layer.name === "cameras") {
            cameras.push(...layer.objects)
        }

        if (layer.name === "colliders") {
            colliders.push(...layer.objects)     
        }
    }

    const player = map.add(makePlayer(k));

    setBackgroundColor(k,"#A2AED5")
    setMapColliders(k,map,colliders)
    setCameraZones(k,map,cameras)
    setCameraControls(k,player,map,roomData)
    player.respawnIfOutOfBounds(1000, "room1");

    for (const position of positions) {
        if(position.name === "player") {
            player.setPosition(position.x,position.y)
            player.setControls();
            player.setEvents(),
            player.enablePassthrough()
            player.respawnIfOutOfBounds(1000,"room1")
            continue;
        }

        if (position.type === "drone") {
            const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
            drone.setBehavior();
            drone.setEvents();
        }

        if (
            position.name === "entrance-1" &&
            previousSceneData.exitName === "exit-1"
        ) {
            player.setPosition(position.x, position.y);
            player.setControls();
            player.enablePassthrough();
            player.setEvents();
            player.respawnIfOutOfBounds(1000, "room1");
            k.setCamPos(player.pos);
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
            player.respawnIfOutOfBounds(1000, "room1");
            k.setCamPos(player.pos);
            continue;
        }

        if (position.name === "boss" && !state.current().isBossDefeated) {
            const boss = map.add(makeBoss(k, k.vec2(position.x, position.y)));
            boss.setBehavior();
            boss.setEvents();
        }

        if (position.type === "cartridge") {
            map.add(makeCartridge(k, k.vec2(position.x, position.y)));
        }
    }

    const exits = layers[7].objects;
    setExitZones(k, map, exits, "room2");


    healthBar.setEvents();
    healthBar.trigger("update");
    k.add(healthBar);
}