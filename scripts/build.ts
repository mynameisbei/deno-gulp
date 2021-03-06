import { clean, dest, series, src, Task } from "../src/index.ts";

// async function build() {
//   await Deno.run({
//     cmd: ["deno", "bundle", "--unstable", "src/index-t.ts", "dist/index.js"],
//     stdout: 'null',
//     stdin: 'null',
//     stderr: 'null',
//   }).status();
// }

function build() {
  src("src/*").pipeTo(dest("dist"));
  return Promise.resolve();
}

interface Tasks {
  build: Task;
  clean: Task;
}

const tasks: Tasks = {
  build: {
    name: "build",
    callback: build,
  },
  clean: {
    name: "clean",
    callback: () => clean("dist"),
  },
};

series(tasks.clean, tasks.build).callback();
