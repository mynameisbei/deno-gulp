import { Task } from "./index.ts";
import { gray, rgb24 } from "https://deno.land/std@0.104.0/fmt/colors.ts";
import { format } from "https://deno.land/std@0.104.0/datetime/mod.ts";

const blue = {
  r: 3,
  g: 102,
  b: 214,
};

const purple = {
  r: 111,
  g: 66,
  b: 193,
};

export async function logTime(task: Task) {
  const getTime = () => format(new Date(), "HH:mm:ss");

  const now = performance.now();
  const startTime = getTime();
  console.log(
    `[${gray(startTime)}] Starting '${rgb24(task.name, blue)}'`,
  );

  await task.callback();

  const end = performance.now();
  const endTime = getTime();
  const duration = (end - now) / 1000;
  console.log(
    `[${gray(endTime)}] Finished '${rgb24(task.name, blue)}' after ${
      rgb24(duration.toFixed(3), purple)
    } s`,
  );
}
