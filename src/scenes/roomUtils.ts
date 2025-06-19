import { GameObj, KAPLAYCtx } from "kaplay";
import { state } from "../state/globalStateManager";

type Collider =  {
    name : string
    x : number
    y : number
    width ?: number
    height ?: number
    type ?: string
    poligon ?: {x : number,y : number}[]
    properties ?: {value : number}[]
}

export function setBackgroundColor(k : KAPLAYCtx,color : string) {
    k.add([
        k.rect(k.width(),k.height()),
        k.color(color),
        k.fixed()
    ])
}

export function setMapColliders(k : KAPLAYCtx,map : GameObj,colliders : Collider[]) {
    for (const collider of colliders) {
        if (collider.poligon) {
            const coordinates = []
            for (const point of collider.poligon) {
                coordinates.push(k.vec2(point.x,point.y))
            }

            map.add([
                k.pos(collider.x,collider.y),
                k.area({
                    shape : new k.Polygon(coordinates),
                    collisionIgnore : [
                        "collider"
                    ]
                }),
                "collider",
                collider.type,
            ])
            continue;
        }

        if (collider.name === "boss-barrier") {
            //TODO: Later
            const bossBarrier = k.add([

            ])
        }

        map.add([
            k.pos(collider.x,collider.y),
            k.area({
                shape : new k.Rect(k.vec2(0),collider.width,collider.height),
                collisionIgnore : ["collider"]
            }),
            k.body({
                isStatic : true
            }),
            "collider",
            collider.type
        ])
    }   
}

export function setCameraControls(k : KAPLAYCtx, player : GameObj,map : GameObj, roomData : any) {
  k.onUpdate(() => {
    if (state.current().isPlayerInBossFight) return;

    if (map.pos.x + 160 > player.pos.x) {
      k.camPos(map.pos.x + 160, k.camPos().y);
      return;
    }

    if (player.pos.x > map.pos.x + roomData.width * roomData.tilewidth - 160) {
      k.setCamPos(
        map.pos.x + roomData.width * roomData.tilewidth - 160,
        k.getCamPos().y
      );
      return;
    }

    k.setCamPos(player.pos.x, k.getCamPos().y);
  });
}

export function setCameraZones(k : KAPLAYCtx, map: GameObj, cameras : Collider[]) {
  for (const camera of cameras) {
    const cameraZone = map.add([
      k.area({
        shape: new k.Rect(k.vec2(0), camera.width, camera.height),
        collisionIgnore: ["collider"],
      }),
      k.pos(camera.x, camera.y),
    ]);

    cameraZone.onCollide("player", () => {
      if (k.getCamPos().x !== camera.properties[0].value) {
        k.tween(
          k.getCamPos().y,
          camera.properties[0].value,
          0.8,
          (val) => k.setCamPos(k.getCamPos().x, val),
          k.easings.linear
        );
      }
    });
  }
}