import {
  emptyDir,
  ensureDir,
  expandGlob,
} from "https://deno.land/std@0.104.0/fs/mod.ts";
import {
  format,
  parse,
  ParsedPath,
  relative,
} from "https://deno.land/std@0.104.0/path/mod.ts";

export interface FileData extends ParsedPath {
  data: Uint8Array;
}

export type FileDataStream = TransformStream<FileData, FileData>;

export function src(glob: string): ReadableStream<FileData> {
  const result = expandGlob(glob);
  return new ReadableStream({
    async pull(controller) {
      for await (const { path } of result) {
        controller.enqueue({
          data: await Deno.readFile(path),
          ...parse(relative(Deno.cwd(), path)),
        });
      }
    },
  });
}

export function dest(path: string) {
  return new WritableStream({
    async write(fileData) {
      await ensureDir(path);
      const { data, ...pathData } = fileData;
      const currentPath = format({
        ...pathData,
        dir: path,
      });

      return Deno.writeFile(currentPath, data);
    }
  });
}

export function clean(path: string) {
  return emptyDir(path);
}
