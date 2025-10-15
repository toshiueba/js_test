async function fetchSchedule(){
    const resultArea = document.getElementById('result');
    const response = await fetch('/api/user_all_schedule');
    const data = await response.json();

    try {
        // テーブル生成
        let html = "<table><tr><th>ID</th><th>Title</th><th>Start Time</th><th>Flag</th></tr>";
        data.forEach(row => {
        html += `<tr>
                    <td>${row.id}</td>
                    <td>${row.title}</td>
                    <td>${row.start_time}</td>
                    <td>${row.start_time}</td>
                </tr>`;
        });
        html += "</table>";
        resultArea.innerHTML = html;
    } catch (err) {
        resultArea.innerHTML = 'エラー: ' + err.message;
    }
}

// 祝日の時に、祝日色に変える
// thisMonthTableの、row, column のセルを、休日色に変える
function set_holiday_color( r, c ){
    rdv = thisMonthTable.rows[r].cells[c].querySelector(".right");
    ldv = thisMonthTable.rows[r].cells[c].querySelector(".left");
    rdv.style.color = `var(--sunday-fg)`;
    ldv.style.color = `var(--sunday-fg)`;
    thisMonthTable.rows[r].cells[c].style.backgroundColor = `var(--sunday-bg)`;
}

// その月のスケジュールを取得する
async function fetchMonthSchedule() {
    try {
        const response = await fetch('/api/user_month_schedule?uid=' + USER_ID + '&year=' + dispYEAR + '&month=' + dispMONTH);
        const data = await response.json();

        let month_str = '';
        let day_str = '';
        let m_int, d_int, d_idx;
        let cal_row, cal_col;
        let rightdev = null;    // 祝日表示エリア
        let botdiv = null;      // スケジュール表示エリア

        data.forEach(row => {
            // 日付取得
            // DBでは、UTCだが、formatDateすると、なぜかTokyo時間になる
            // Geminiでは、utcDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });をやれと言われたが、formatDateでいけている。
            // day_str = formatDate(row.start_time).substring(8,10);
            day_str = row.start_time.substring(8,10);
            // 日のindexは、日付の数値 -1
            d_idx = parseInt(day_str,10) - 1;
            cal_row = ThisMonth_ARRAY[d_idx].row;
            cal_col = ThisMonth_ARRAY[d_idx].col;
            rightdiv = thisMonthTable.rows[cal_row].cells[cal_col].querySelector(".right");
            botdiv = thisMonthTable.rows[cal_row].cells[cal_col].querySelector(".bottom");
            // 祝日だったら右上に表示
            if ( row.theme_name == holiday_keyword ){
                rightdiv.textContent = row.title;
                // 祝日なので、休日色に変えておく
                set_holiday_color(cal_row, cal_col);
            } else {
                // 祝日でなければ、スケジュールなので、下に表示
                let sc1 = document.createElement("div");
                sc1.textContent = row.title;
                // ここは、後で、カテゴリー別に色を変えるロジックを入れる
                sc1.style.color = `var(--weekday-fg)`;
                botdiv.appendChild(sc1);
            }

        });

    } catch (err) {
        document.getElementById("result").textContent = "エラー: " + err;
    }
}
