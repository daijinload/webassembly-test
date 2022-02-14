# dart-wasm 

Dart言語のセットアップはflutterのセットアップを参考にして行ってください。

■flutter setup
https://docs.flutter.dev/get-started/install

## 実行

```bash
dart pub get
dart run wasm:setup
wat2wasm square.wat -o square.wasm
dart run
```

## setup したときのコマンド

```bash
dart create dart-wasm
cd dart-wasm/
dart run
dart pub add wasm
dart pub get
dart run wasm:setup
wat2wasm square.wat -o square.wasm
dart run
```

## 参考記事
https://github.com/dart-lang/wasm
