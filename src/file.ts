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
import {
  readableStreamFromReader,
  writableStreamFromWriter
} from "https://deno.land/std@0.104.0/io/mod.ts";

export interface FileData extends ParsedPath {
  data: ReadableStream;
}

export type FileDataStream = TransformStream<FileData, FileData>;

export function src(glob: string): ReadableStream<FileData> {
  const result = expandGlob(glob);
  return new ReadableStream({
    async pull(controller) {
      for await (const { path } of result) {
        const file = await Deno.open(path, { read: true, });
        const stream = readableStreamFromReader(file);
        controller.enqueue({
          data: stream,
          ...parse(relative(Deno.cwd(), path)),
        });
      }
    },
  });
}

export function dest(path: string) {
  return new WritableStream({
    async write(fileData: FileData) {
      await ensureDir(path);
      const { data, ...pathData } = fileData;
      const currentPath = format({
        ...pathData,
        dir: path,
      });

      const file = await Deno.open(currentPath, { write: true, create: true });
      const stream = writableStreamFromWriter(file);
      return data.pipeTo(stream);
      // return Deno.writeFile(currentPath, data);
    }
  });
}

export function clean(path: string) {
  return emptyDir(path);
}
