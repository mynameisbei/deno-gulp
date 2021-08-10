import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";
import { series } from '../src/task.ts';

Deno.test("", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
