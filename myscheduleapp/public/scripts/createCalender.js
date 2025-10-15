// カレンダーを作って描く

// カレンダーテーブル
// let thisMonthTable = document.getElementById("monthTable");

function dispYearMonth(year, month){
    document.getElementById("ymDispArea").innerHTML = year + '年' + month + '月';    
}

// thisMonth Arrayに今月の日付データをセットする
function createCalender(){
    // 今月の日数を計算
    // Dateの第3引数に0を入れると、前月の末日を表すことを利用
    // const lastDayOfThisMonth = new Date(YEAR, MONTH + 1, 0);
    const lastDayOfThisMonth = new Date(dispYEAR, dispMONTH, 0);
    const daysInMonth = lastDayOfThisMonth.getDate();

    // 今月の各日に対してCalDayインスタンスを作成し、配列に追加
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(dispYEAR, dispMONTH - 1, i);
        const dow = date.getDay(); // getDay()は0=日曜日, 1=月曜日, ...
        const calDayInstance = new CalDay(dispYEAR, dispMONTH - 1, i, dow);
        // 配列に追加
        ThisMonth_ARRAY.push(calDayInstance)
    }
    // for debug
    // ThisMonth_ARRAY.forEach( td => td.writeCalDay());
}

function calc_max_crow( first_dow, max_day ){
    // カレンダーの行数を計算する
    // 第１引数：その月の１日の曜日、第２引数：その月の日数
    // 表示する曜日は、グローバルの DOW_VECTOR にあるので、上の２つの引数からその月の表示行数が計算できる。
    const no_of_cells = DOW_VECTOR.indexOf( first_dow ) + max_day;
    const rows = Math.floor(no_of_cells / 7);
    const reminder = no_of_cells % 7;
    // +1は、ヘッダ行の分
    return 1 + rows + (reminder > 0 ? 1 : 0);
}

function make_oneday_grid(){
    // 1日のセル内のgridを作って返す
    let grid = document.createElement("div");
    grid.className = "grid-container";
    // 各要素を作成して追加
    const left = document.createElement("div");
    left.className = "left";
    // left.textContent = "左上";
    const right = document.createElement("div");
    right.className = "right";
    // right.textContent = "右上";
    const bottom = document.createElement("div");
    bottom.className = "bottom";
    // bottom.textContent = "下";
    // gridに追加
    grid.appendChild(left);
    grid.appendChild(right);
    grid.appendChild(bottom);
    return grid;
}

function dispCalender(){
    // 表の曜日vectorを作る
    for( i=0; i<7; i++){
        DOW_VECTOR.push( (i + START_DOW) % 7 );
    }

    // 表の行数を計算する
    MAX_CALENDER_ROW = calc_max_crow(ThisMonth_ARRAY[0].dow, ThisMonth_ARRAY.length);  // 1日の曜日と、その月の日数。表示する曜日情報は DOW_VECTORから取る。

    // テーブルを生成する
    // まずヘッダーを書いて、
    thisMonthTable.innerHTML = '<thead><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></thead>';

    // 1行目は、曜日の文字列を表示するヘッダ行
    for( i=0; i<MAX_CALENDER_ROW -1; i++){
        const newRow = thisMonthTable.insertRow();
        for (j=0; j<7; j++){
            const newCell = newRow.insertCell();
            const grid = make_oneday_grid();
            newCell.appendChild(grid);
        }
    }

    // 曜日を描く。
    for( i=0; i<7; i++){ // columnで回す
        // 曜日の色セット
        if (DOW_VECTOR[i] === 0 || DOW_VECTOR[i] === 6 ) {  // 土日
            thisMonthTable.rows[0].cells[i].style.color = `var(--sunday-fg)`;
            for( j=0; j<MAX_CALENDER_ROW; j++){
                thisMonthTable.rows[j].cells[i].style.backgroundColor = `var(--sunday-bg)`;
            }
        }
        // 曜日のヘッダ文字
        thisMonthTable.rows[0].cells[i].textContent = DOW_KANJI[DOW_VECTOR[i]];
    }

    // 日付を記入する
    let cr = 1;     // 現在記入中の行index. 0はヘッダー行なので1から。
    // 1日の曜日は、ThisMonth_ARRAY[0].dow
    // 表の該当する場所は、DOW_VECTOR内の、その曜日の入っているindex.
    
    const firstDay_column = DOW_VECTOR.indexOf( ThisMonth_ARRAY[0].dow );
    let jj=firstDay_column;    // 1日のカラム位置
    for (idx=0; idx<ThisMonth_ARRAY.length; idx++){
        //
        if( (ThisMonth_ARRAY[idx].dow == DOW_VECTOR[0]) && (idx != 0) ) { // その日が表示週の最初の曜日と同じなら次の行。ただし最初の日はそのまま
            cr++;
            jj=0;
        }
        // 今日だったら、特別にマークして、セル位置をグローバルにセットしておく
        if( idx+1 == TODAY.getDate() ){
            Today_RC.push(cr);
            Today_RC.push(jj);
        }
        // 日付の数字を書き込む
        const leftdiv = thisMonthTable.rows[cr].cells[jj].querySelector(".left");
        if ( DOW_VECTOR[jj] == 0 || DOW_VECTOR[jj] == 6){
            leftdiv.style.color = "var(--sunday-fg)";
        }
        const tmpday = ThisMonth_ARRAY[idx].day;
        leftdiv.textContent = tmpday;
        // その日のセルがクリックされたら、日付を引数にして、新規登録を呼ぶ
        const selcel = thisMonthTable.rows[cr].cells[jj];
        selcel.addEventListener('click', () => { addSchedule( tmpday );});

        // ThisMonth_ARRAYのCalDayに、カレンダー上の行位置と列位置をセットしておく
        ThisMonth_ARRAY[idx].row = cr;
        ThisMonth_ARRAY[idx].col = jj;
        // 列を進める
        jj++;
    }

    // 日付のないセルをグレーアウト
    const lastidx = ThisMonth_ARRAY.length -1;
    const lastDay_column = DOW_VECTOR.indexOf( ThisMonth_ARRAY[lastidx].dow );
    // 最初 firstDay_columnは既にある。ヘッダ行の下なので、rows[1]
    if( firstDay_column != 0){
        for( j=0; j<firstDay_column; j++ ){
            // 最初の行だけ、休日は別の色
            if( DOW_VECTOR[j] == 0 || DOW_VECTOR[j] == 6){
                thisMonthTable.rows[1].cells[j].style.backgroundColor = `var(--sunday-lighter-bg)`;
            } else {
                thisMonthTable.rows[1].cells[j].style.backgroundColor = `var(--outday-bg)`;
            }
        }
    }
    // 最後
    // MAX_CALENDER_ROW -1 行の、lastDay_column から右のセルをグレーにする
    if (lastDay_column != 6) {
        for( j=lastDay_column+1; j<7; j++){
            const tgcell = thisMonthTable.rows[MAX_CALENDER_ROW -1].cells[j];
            tgcell.innerHTML = "";
            tgcell.style.backgroundColor = `var(--outday-bg)`;
        }
    }
    // 本日の日付のスタイルを変える
    if ( dispYEAR == YEAR && dispMONTH == trueMONTH ){
        let tgdiv = thisMonthTable.rows[Today_RC[0]].cells[Today_RC[1]].querySelector('.left');
        if (tgdiv) {
            tgdiv.style.backgroundColor = `var(--today-char-bg)`;
            tgdiv.style.borderRadius = "25%";
        }
    }
    // 行の高さを固定する。TableのRow.style.heightの固定でいけた！
    let r1 = thisMonthTable.rows[1];
    let h_offset_str = r1.offsetHeight + 'px';
    let tblrow = null;
    // 先頭行はcssで固定されているので、i=1から
    for( i=1; i<MAX_CALENDER_ROW; i++){
        tblrow = thisMonthTable.rows[i];
        tblrow.style.height = h_offset_str;
    }
}
