import { clean, series, Task, addNotice, src, dest } from "../src/index.ts";

async function test() {
  const datas = await src('src/index-t.ts');
  for (const data of datas) {
    await addNotice(data, '// hello this is notice');
  }
  return dest('src', datas);
}

async function build() {
  await Deno.run({
    cmd: ["deno", "bundle", "--unstable", "src/index-t.ts", "dist/index.js"],
    stdout: 'null',
    stdin: 'null',
    stderr: 'null',
  }).status();
}

interface Tasks {
  build: Task;
  clean: Task;
  test: Task;
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
  test: {
    name: 'test',
    callback: test
  }
};

series(tasks.clean, tasks.test, tasks.build).callback();
