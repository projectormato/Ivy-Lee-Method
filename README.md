# Ivy-Lee-Method
The ToDo list for Ivy Lee Method.

最新のScalaのドキュメントは[こちら](https://www.playframework.com/documentation/2.6.x/Home)です。

## Running
### Back
```bash
sbt run
```
localhost:9000にアクセス、DBが無いと言われたら`[Apply this script now!]`ボタンを押して作成してください。

### Front

```bash
cd front/
npm run dev
```
localhost:8080にアクセス、ToDoが表示されていたらOK

## What is this
以下のようなToDoを管理するToDoリストです。
* 今日やること： 6個前後
* (今日ではなく)やりたいこと、やること： 複数
* バッチ(最後にまとめてやるタスク)、習慣化： 複数

Ivy Lee Methodについては[こちら](https://matome.naver.jp/odai/2150318003473236501)のまとめや[こちら](https://www.amazon.co.jp/dp/4761271760)の本などが参考になります。

## Constitution
バックエンドはScala(Play Framework)、フロントはVue.jsです。  
PWAに対応しています。
