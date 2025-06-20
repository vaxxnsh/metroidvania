import { makePlayer } from './entities/player';
import { k } from './kaboomLoader'
import { room1 } from "./scenes/room1";
import { room2 } from "./scenes/room2";
import { setBackgroundColor } from './scenes/roomUtils';
import { makeNotificationBox } from './ui/notificationBox';

async function main() {

    const room1Data = await (await fetch('/maps/room1.json')).json();
    const room2Data = await (await fetch('/maps/room2.json')).json();

    k.scene("room1",(previousSceneData) => {
        room1(k,room1Data,previousSceneData);
    })

    k.scene("room2",(previousSceneData) => {
        room2(k,room2Data,previousSceneData);
    })

    k.scene("intro", () => {
        setBackgroundColor(k, "#20214a");
        k.add(
            makeNotificationBox(
            k,
            "Escape the factory!\nUse arrow keys to move, x to jump, z to attack.\nPress Enter to start!"
            )
        );
        k.onKeyPress("enter", () => {
            const context = new AudioContext();
            context.resume();
            k.go("room1", { exitName: null });
        });
    });

    k.scene("final-exit", () => {
        setBackgroundColor(k, "#20214a");
        k.add(
            makeNotificationBox(
                k,
                "You escaped the factory!\n The End. Thanks for playing!"
            )
        );
    });

    k.go("intro")
}

main()