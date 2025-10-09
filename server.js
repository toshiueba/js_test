
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// publicフォルダを公開
app.use(express.static('public'));

app.get('/sqltest', (req, res) => {
  // DBファイルの絶対パスを取得
  const dbPath = path.join(__dirname, 'test.db');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ error: 'DB接続エラー: ' + err.message });
    }
  });

  db.all('SELECT id, name, age FROM users', (err, rows) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: 'DBクエリエラー: ' + err.message });
    }
    res.json({ users: rows });
  });
});

app.listen(3000, () => {
  console.log('http://localhost:3000 でサーバーが起動中');
});
