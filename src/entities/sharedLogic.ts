import { GameObj, KAPLAYCtx } from "kaplay";

export async function makeBlink(k : KAPLAYCtx, entity : GameObj, timespan = 0.1) {
  await k.tween(
    entity.opacity,
    0,
    timespan,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
  k.tween(
    entity.opacity,
    1,
    timespan,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
}
