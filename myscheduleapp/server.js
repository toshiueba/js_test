const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// publicフォルダを公開
app.use(express.static('public'));

// APIエンドポイント
// target user の全てのスケジュールを返す（テスト用）
app.get('/api/user_all_schedule', async (req, res) => {

  try {
    const dbPath = path.join(__dirname, 'schedule.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return res.status(500).json({ error: 'DB接続エラー: ' + err.message });
      }
    });

    db.all('SELECT id, title, start_time, end_time FROM schedule', (err, rows) => {
      db.close();
      if (err) {
        return res.status(500).json({ error: 'DBクエリエラー: ' + err.message });
      }
      res.json(rows);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

/*
// target user の　特定の１ヵ月のスケジュールを返す
// パラメータ　year, month
app.get('/api/user_month_schedule', async (req, res) => {
  try {
    // クエリパラメータから uid, year, month を取得
    const uid = parseInt(req.query.uid);
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (isNaN(uid) || isNaN(year) || isNaN(month)) {
      return res.status(400).json({ error: "uid, year, month を指定してください" });
    }

    // 月初と翌月初を作成
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

    // カラム：schedule_id,title,start_time,end_time,description,theme_name,schedule_type(user/group),owner_id,target_user_id
    const query = `SELECT * FROM user_schedule_view WHERE target_user_id = $1 AND
      start_time < $2 AND end_time >= $3
      ORDER BY start_time;
    `;
    const values = [uid, endDate, startDate];

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});
*/

app.listen(3000, () => {
  console.log(`http://localhost:3000 でサーバー起動中`);
});
