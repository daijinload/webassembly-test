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

// 名前は適当だが、main関数もどき
export function ddd(): usize {

  // 受け取ったjsonのパースをする。非常にめんどい感じ。。。
  const inputJsonStr = String.UTF8.decodeUnsafe(inStrPtr, PARAM_SIZE, true)
  Console.log(inputJsonStr)

  // 引数のjson文字列からnameプロパティを取り出す。
  let name = ''
  const inputJson = <JSON.Obj>JSON.parse(inputJsonStr)
  if (inputJson !== null) {
    const _name = inputJson.getString('name')
    if (_name !== null) {
      Console.log(_name.toString())
      name = _name.toString()
    }
  }

  // jsonで書くとダルいので、文字列jsonを書いてみる。
  // ダブルクォーテーションのみ、\マーク付ける必要あるからそこだけ注意かなぁ。
  const rtnStr = `{name:${name.toString()}${name.toString()}}`

  Console.log(rtnStr)
  Console.log(`${byteLength(rtnStr)}`)
  const size = writeRtnOutput(rtnStr)
  return size
}

export function eee(str: string): usize {
  //Console.log(str)
  return changetype<usize>(str);
}
export function eee2(): usize {
  //Console.log(str)
  return byteLength('{name:🌠🌠}');
}

// export function fff(): [u8, u8] {
//   return [1, 2]
// }


// export function ddd(): u8 {
//   store8(mPtr, 0, 5)
//   // Console.log(mPtr.toString())
//   // memory.fill(mPtr, 0, 1)
//   return load8(mPtr, 0)
//   // return load8(rPtr, 1)
// }
























// @inline
// function store8(ptr: usize, offset: usize, u: u8): void {
//   store<u8>(ptr + offset, u);
// }

// @inline
// function load8(ptr: usize, offset: usize): u8 {
//   return load<u8>(ptr + offset);
// }

// const M = new ArrayBuffer(64);
// const mPtr = changetype<usize>(M);

// const R = new ArrayBuffer(64);
// const rPtr = changetype<usize>(R);

// export function ddd(): u8 {
//   store8(mPtr, 0, 5)
//   // Console.log(mPtr.toString())
//   // memory.fill(mPtr, 0, 1)
//   return load8(mPtr, 0)
//   // return load8(rPtr, 1)
// }


// const arr = ["aa", "bb"]

// export function ddd(): void {
//   const ccc = arr[0]
//   if (ccc != null) {
//     console.log(ccc)
//   }

//   // getStoreBytes(1)
// }

// export function ddd(src: i32, inNum: i32, outNum: i32): void {
//   switch(src) { 
//     case 1: { 
//       // const str = Console.readAll() || ''
//       // if (str !== null) {
//       //   Console.log("zzz" + str);
//       // }
//       Console.log("zzz");
//       break; 
//     } 
//     case 2: { 
//       const str = _fread(inNum)
//       _fwrite(outNum, "zzz" + str)
//        break; 
//     } 
//     default: { 
//       throw new Error(`src required, std=1, file=2 src=${src}`);
//     } 
//  } 
// }

// function _fread(inNum: i32): string {
//   let filePath: string = `${inNum}.txt`;
//   let fileOrNull: Descriptor | null = FileSystem.open(filePath);
//   if (fileOrNull === null) {
//     throw new Error("Could not open the file " + filePath);
//   }
//   let file = changetype<Descriptor>(fileOrNull);
//   const strOrNull = file.readString()
//   if (strOrNull === null) {
//     throw new Error("Could not read the file " + filePath);
//   }
//   return strOrNull
// }
// function _fwrite(outNum: i32, str: string): void {
//   let filePath: string = `${outNum}.txt`;
//   let fileOrNull: Descriptor | null = FileSystem.open(filePath, "w+");
//   if (fileOrNull == null) {
//     throw new Error("Could not open the file " + filePath);
//   }
//   let file = changetype<Descriptor>(fileOrNull);
//   file.writeStringLn(str);
// }


// export function _start(): void {
//   let filePath: string = "fff.txt";
//   let fileOrNull: Descriptor | null = FileSystem.open(filePath, "w+");
//   if (fileOrNull == null) {
//     throw new Error("Could not open the file " + filePath);
//   }
//   let file = changetype<Descriptor>(fileOrNull);
//   file.writeStringLn("Hello World!");
// //  FileSystem.mkdir('./fff')
// }

// export function _start(): void {
//   const aaa = Console.readAll() || ''
//   if (aaa !== null) {
//     Console.log("ccc" + aaa + "ccc");
//   }
// }

// export function aaa(): string {
//   return 'abc'
// }


// export function _start(): void {
//   Console.log("hello world!!");
// }

// export function add(a: i32, b: i32): i32 {
//   return a + b;
// }

// import { JSON } from "assemblyscript-json"; 
// // import { JSONEncoder } from "assemblyscript-json";
// expimport { JSON } from "assemblyscript-json";
// expimport { JSONEncoder } from "assemblyscript-json";
// export fuimport { JSONEncoder } from "assemblyscript-json";
// function aaa(): JSON.Obj {
//   let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse('{"hello": "world", "value": 24}'));
//   // let enc = new JSONEncoder();
//   // enc.setInteger('aaa', 111)
//   // enc.popObject()
//   return jsonObj
// }

// class Aaa {
//   p1: i32;
//   p2: i32;
// }
// var aaa: Aaa = { p1: 2, p2: 3 };

// export function ccc(): u8 {
//   return 1;
// }

// export function _start(): void {
//   Console.log('hello')
// }

// const NUM = 20

// export function add(a: i32): i32 {
//   return a + NUM;
// }

// export function sss(str: string): void {
//     Console.log(str);
// }
