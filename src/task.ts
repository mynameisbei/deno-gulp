import { logTime } from './index.ts';
export interface Task {
  name: string | TaskName;
  callback: TaskCallBack;
}
export type TaskCallBack = (...args: any[]) => Promise<any>;

export interface MetadataTree {
  label: string | TaskName;
  type: MetadataTreeType;
  nodes: MetadataTree[];
  branch?: boolean;
}

export interface MetadataValue {
  name: string | TaskName;
  tree: MetadataTree;
  orig?: Task;
  branch?: boolean;
}

export type Metadata = WeakMap<Task, MetadataValue>;

export enum MetadataTreeType {
  task = "task",
  fn = "function",
}

export enum TaskName {
  parallel = "<parallel>",
  series = "<series>",
}

const metadata: Metadata = new WeakMap();
const taskMap = new Map<string, Task>();

export function task(name: string, task?: Task) {
  if (!task) {
    return getTask(name);
  } else {
    setTask(name, task);
  }
}

function getTask(name: string) {
  return taskMap.get(name);
}

function setTask(name: string, task: Task) {
  const meta = metadata.get(task) || {} as MetadataValue;
  const nodes: MetadataTree[] = [];
  if (meta.branch) {
    nodes.push(meta.tree);
  }

  taskMap.set(name, task);

  metadata.set(task, {
    name,
    orig: task,
    tree: {
      label: name,
      type: MetadataTreeType.task,
      nodes,
    },
  });
}

function buildTree(tasks: Task[] = []): MetadataTree[] {
  return tasks.map((task) => {
    const meta = metadata.get(task);
    if (meta) {
      return meta.tree;
    } else {
      const { name } = task;
      const value: MetadataValue = {
        name,
        tree: {
          label: name,
          type: MetadataTreeType.fn,
          nodes: [],
        },
      };
      metadata.set(task, value);

      return value.tree;
    }
  });
}

function compose(tasks: Task[], callback: TaskCallBack, name: TaskName): Task {
  const task: Task = {
    name,
    callback,
  };

  metadata.set(task, {
    name,
    branch: true,
    tree: {
      label: name,
      type: MetadataTreeType.fn,
      nodes: buildTree(tasks),
    },
  });

  return task;
}

export function series(...tasks: Task[]): Task {
  const cb = async () => {
    for (const task of tasks) {
      await logTime(task);
    }
  };

  return compose(tasks, cb, TaskName.series);
}

export function parallel(...tasks: Task[]): Task {
  const cb = () => {
    const result = tasks.map((task) => logTime(task));
    return Promise.all(result);
  };

  return compose(tasks, cb, TaskName.parallel);
}
