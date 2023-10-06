# www

Gobbletの動作確認用Webページ


# localhostの立て方

## 1. npmの必要なモジュールをインストールする

```sh
www> npm ci --save-dev
```

## 2. ビルド方法

```sh
# develop版
www> npm run build-dev
# release版
www> npm run build
```

`dist`フォルダが生成され、そのフォルダに実行ファイルが生成される。

## 3. Webページを立ち上げる

```sh
www> npm run start
```

localhost:8080にアクセスするとWebページが見れる。


# License

* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
