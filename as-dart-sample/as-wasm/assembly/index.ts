import { Console, Descriptor, FileSystem } from "as-wasi";
import { JSON } from "assemblyscript-json";

// スタティックな関数群
function store8(ptr: usize, offset: usize, u: u8): void {
  store<u8>(ptr + offset, u);
}
function store32(ptr: usize, offset: usize, u: u32): void {
  store<u32>(ptr + (offset << alignof<u32>()), u);
}
function load8(ptr: usize, offset: usize): u8 {
  return load<u8>(ptr + offset);
}
function byteLength(str: string): u32 {
  return String.UTF8.encode(str).byteLength
}
function writeRtnOutput(rtnStr: string): i32 {
  const list = Uint8Array.wrap(String.UTF8.encode(rtnStr))
  const size = list.byteLength
  for (let i = 0; i < size; i++) {
    store8(outStrPtr, i, list[i])
  }
  return size
}

// 引数のやりとりをするためのメモリ領域確保とポインタ取得
const PARAM_SIZE = 64;
const IN_STR = new ArrayBuffer(PARAM_SIZE);
export const inStrPtr = changetype<usize>(IN_STR);
const OUT_STR = new ArrayBuffer(PARAM_SIZE);
export const outStrPtr = changetype<usize>(OUT_STR);
export function initMemoryParams(): void {
  initMemoryParamInput()
  initMemoryParamOutput()
}
export function initMemoryParamInput(): void {
  memory.fill(inStrPtr, 0, PARAM_SIZE)
}
export function initMemoryParamOutput(): void {
  memory.fill(outStrPtr, 0, PARAM_SIZE)
}

// 名前は適当だが、main関数もどき
export function ddd(): usize {
  Console.log('-------------------- wasm start')

  // 受け取ったjsonのパースをする。非常にめんどい感じ。。。
  const inputJsonStr = String.UTF8.decodeUnsafe(inStrPtr, PARAM_SIZE, true)
  Console.log(inputJsonStr)

  // 引数のjson文字列からnameプロパティを取り出す。
  let escapedName: string = ''
  const inputJson = <JSON.Obj>JSON.parse(inputJsonStr)
  if (inputJson !== null) {
    const name = inputJson.getString('name')
    if (name !== null) {
      // toStringも出来るが、json文字列にする場合は、
      // ダブルクォーテーションなどエスケープする必要があるので、stringifyを使う。
      Console.log(name.stringify())
      escapedName = name.stringify()
    }
  }

  // jsonで書くとダルいので、文字列jsonを書いてみる。
  const rtnStr = `{name:${escapedName}${escapedName}}`

  Console.log(rtnStr)
  Console.log(`${byteLength(rtnStr)}`)
  const outputSize = writeRtnOutput(rtnStr)

  // input配列をリセットする
  initMemoryParamInput()
  Console.log('-------------------- wasm end')
  return outputSize
}

// さらに部分的にテストするためのサンプル関数
export function eee(str: string): usize {
  //Console.log(str)
  return changetype<usize>(str);
}
export function eee2(): usize {
  //Console.log(str)
  return byteLength('{name:🌠🌠}');
}

// Retrunマルチバリューは出来るっぽい話があるが、ASは、まだ未対応？。
// export function fff(): [u8, u8] {
//   return [1, 2]
// }

// 標準入出力と、ファイルのread, write関数
// メモリを直接扱う形ではないので、wasmtimeなどのランタイムでも簡単に動かせて便利。
// 主にテスト用かと。
// wasiのファイルタイプが扱えるなら引数や返却値をファイルにすると楽だが、
// レイテンシやSSDの寿命が気になる場合はメモリ式が良いか？
export function ggg(type: i32, inNum: i32, outNum: i32): void {
  switch (type) {
    case 1: {
      const str = Console.readAll()
      if (str !== null) {
        Console.log("input=" + str);
        break;
      }
      Console.log("input not found!!");
      break;
    }
    case 2: {
      // ファイルを扱う場合は、ディレクトリを指定して使うので、ファイル名は数値で良いかと。
      const str = _fread(inNum)
      _fwrite(outNum, "zzz" + str)
      break;
    }
    default: {
      throw new Error(`type required, std=1, file=2 type=${type}`);
    }
  }
}
function _fread(inNum: i32): string {
  let filePath: string = `${inNum}.txt`;
  let fileOrNull: Descriptor | null = FileSystem.open(filePath);
  if (fileOrNull === null) {
    throw new Error("Could not open the file " + filePath);
  }
  let file = changetype<Descriptor>(fileOrNull);
  const strOrNull = file.readString()
  if (strOrNull === null) {
    throw new Error("Could not read the file " + filePath);
  }
  return strOrNull
}
function _fwrite(outNum: i32, str: string): void {
  let filePath: string = `${outNum}.txt`;
  let fileOrNull: Descriptor | null = FileSystem.open(filePath, "w+");
  if (fileOrNull == null) {
    throw new Error("Could not open the file " + filePath);
  }
  let file = changetype<Descriptor>(fileOrNull);
  file.writeStringLn(str);
}
