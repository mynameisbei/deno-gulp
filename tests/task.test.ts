import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import { random } from 'https://unpkg.com/lodash-es@4.17.21/lodash.js';
import { series, Task, parallel } from '../src/task.ts';

const DELAY = 200;

const getRandomTime = () => {
  return random(1, 2) * DELAY;
};

Deno.test("task run sequential", async () => {
  let count = 0;
  const cb = (i: number) => () => {
    return new Promise((resolve) => {
      count = count + 1;
      assertEquals(count, i);
      setTimeout(() => {
        resolve(null);
      }, getRandomTime());
    });
  };
  const a: Task = { callback: cb(1), name: 'a'};
  const b: Task = { callback: cb(2), name: 'b' };
  const c = series(a, b);
  const d: Task = { callback: cb(3), name: 'd' };
  await series(c, d).callback();
});

Deno.test("task run concurrently", async () => {
  let count = 0;
  const cb = (i: number) => () => {
    return new Promise((resolve) => {
      assertEquals(count, i);
      setTimeout(() => {
        count = count + 1;
        resolve(null);
      }, getRandomTime());
    });
  };
  const a: Task = { callback: cb(0), name: 'a'};
  const b: Task = { callback: cb(0), name: 'b' };
  const c = parallel(a, b);
  const d: Task = { callback: cb(0), name: 'd' };
  await parallel(c, d).callback();
});

Deno.test("task run concurrently and sequential", async () => {
  let count = 0;
  const cb = (i: number) => () => {
    return new Promise((resolve) => {
      assertEquals(count, i);
      setTimeout(() => {
        count = count + 1;
        resolve(null);
      }, getRandomTime());
    });
  };
  const a: Task = { callback: cb(0), name: 'a'};
  const b: Task = { callback: cb(0), name: 'b' };
  const c = parallel(a, b);
  const d: Task = { callback: cb(2), name: 'd' };
  await series(c, d).callback();
});
