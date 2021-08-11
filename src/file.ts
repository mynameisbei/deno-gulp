import {
  ensureDir,
  expandGlob,
  WalkEntry,
  emptyDir,
} from "https://deno.land/std@0.104.0/fs/mod.ts";
import {
  format,
  parse,
  ParsedPath,
  relative,
} from "https://deno.land/std@0.104.0/path/mod.ts";
import { concat } from "https://deno.land/std@0.104.0/bytes/mod.ts";
import { StringReader } from "https://deno.land/std@0.104.0/io/mod.ts";

export interface FileData extends ParsedPath {
  data: Uint8Array;
}

export async function src(glob: string): Promise<FileData[]> {
  const result = expandGlob(glob);
  const files = [];
  for await (const file of result) {
    files.push(file);
  }

  return handleFiles(files);
}

async function handleFiles(files: WalkEntry[]): Promise<FileData[]> {
  const result = [];
  for (const { path } of files) {
    result.push({
      data: await Deno.readFile(path),
      ...parse(relative(Deno.cwd(), path)),
    });
  }
  return result;
}

export async function dest(path: string, fileDatas: FileData[]) {
  await ensureDir(path);
  for (const fileData of fileDatas) {
    const { data, ...pathData } = fileData;
    const currentPath = format({
      ...pathData,
      dir: path,
    });
    Deno.writeFile(currentPath, data);
  }
}

export function clean(path: string) {
  return emptyDir(path);
}

export async function addNotice(fileData: FileData, notice: string) {
  const data = new Uint8Array(notice.length);
  const reader = new StringReader("abcdef");
  await reader.read(data);
  fileData.data = concat(data, fileData.data);
  return fileData;
}
