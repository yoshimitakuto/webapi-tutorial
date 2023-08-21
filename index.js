// console.log("サーバー起動🌟");

// expressを呼ぶ
const express = require("express");
// express関数を使用して使える状態にする
const app = express();
// handlebarsを使用するためにインポートしてあげる
const { engine } = require("express-handlebars");
// req.body.~~を使用する際は「body-parser」をインストール及び定義する必要がある
const bodyParser = require('body-parser');

// handlebarsを使用できるようにする（公式より引用）
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));

// postする際にjson形式を採用することをexpressに伝える必要があるための記述
app.use(express.json());


// listen関数でローカルサーバーを立ち上げることができる
app.listen(8000, console.log("サーバー起動🚀"));

// getメソッドを定義して実際にlocalhost:8000が起動していることを確認する
app.get("/", (req, res) => {
    // クライアントからのリクエストに対して返す処理を記述
    res.render('home');
});

// お客様情報をサーバーに置いておく（JSON形式での記述方法）
// 以下の情報をクライアントへ返す
const customers = [
    {name: "安藤", id: 1},
    {name: "斎藤", id: 2},
    {name: "田中", id: 3},
    {name: "近藤", id: 4},
    {name: "金子", id: 5},
];

// データを取得できるようにする（CRUD処理）
app.get("/api/customers", (req, res) => {
    res.send(customers);
});

// エンドポイント作成　→ "/api/customers"（リソース）のこと
app.get("/api/customers/:id", (req, res) =>{
    // find関数を用いてURLへ入力された数字をparseIntで数値として受け取り、特定のユーザーのidを配列で作成したcustomersの中から探し、一致するidの情報をクライアントへ渡す
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    // ユーザー情報があるかどうか判定
    if (customer == null ) {
        res.send("ないよ〜");
    } else {
        res.send(customer);
        res.render('customer')
    };
});


// データを送信（作成）してみる（post）
app.post("/api/customers", (req, res) => {
    const customer = {
        // idはcustomersにすでにある数値にプラスしていく形を取る
        name: req.body.name,
        id: customers.length + 1,
    };
    // 新たに作成したお客様情報をcustomersに追加する（pushする）
    customers.push(customer);
    res.send(customers);
    res.redirect("/api/customers");
});


// データを更新してみる（put）
app.put("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    customer.name = req.body.name;
    // ユーザー情報があるかどうか判定
    if (customer == null ) {
        res.send("ないよ〜");
    } else {
        res.send(customer);
    };  
});


// データを削除してみる（delete）
app.delete("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    // 配列の中のインデックス番号を参照しindexへ値を格納する
    const index = customers.indexOf(customer);
    // 指定したインデックス番号を１つだけ削除するという記述
    customers.splice(index, 1);

    res.send(customer);
});