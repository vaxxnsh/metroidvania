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

    k.scene("intro",() => {
        k.onKeyPress("enter",() => {
            k.go("room1")
        })
    })

    k.go("intro")
}

main()