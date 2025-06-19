import { makePlayer } from './entities/player';
import { k } from './kaboomLoader'
import { room1 } from "./scenes/room1";
import { room2 } from "./scenes/room2";

async function main() {

    const room1Data = await (await fetch('/maps/room1.json')).json();
    const room2Data = await (await fetch('/maps/room2.json')).json();

    k.scene("room1",() => {
        room1(k,room1Data);
    })

    k.scene("room2",() => {
        room2();
    })

    k.scene("intro", () => {
    // Optional black background
    k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.pos(0, 0),
        k.z(-1),
    ]);

    // Add player entity (from makePlayer)
    const player = k.add(makePlayer(k));
    player.setPosition(k.width() / 2, k.height() / 2);
    player.setControls(); // allow control even in intro
    player.setEvents();
    player.enablePassthrough();

    // Optional: instruction text
    k.add([
        k.text("Press Enter to Start", { size: 24 }),
        k.pos(k.width() / 2, k.height() - 60),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    k.onKeyPress("enter", () => {
        k.go("room1");
    });
    });


    k.go("intro")
}

main()