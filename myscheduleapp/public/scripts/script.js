// グローバル
let USER_ID = 0;    //  初期値。ログインなどのプロセスで設定される
const DOW_KANJI = ['日','月','火','水','木','金','土'];
const TODAY = new Date();
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth(); // getMonth()は0から始まるため、0=1月, 1=2月, ...
const trueMONTH = MONTH + 1;  // 表示用の月に直す
let dispYEAR = YEAR;          // 表示するカレンダーの年、初期値は今年
let dispMONTH = trueMONTH;    // 表示するカレンダーの月、初期値は今月
let MAX_CALENDER_ROW = 1;   // カレンダーの行数はその月によって変わる。後で計算する。ヘッダ行含む。
let ThisMonth_ARRAY = [];   // 今月の日付Array
let START_DOW = 1;          // 週の始まりの曜日 0:日曜、1:月曜　その他もできるが、通常はこのどちらか
// カレンダーの曜日を表すベクトル。週の初めを変えられる機能用。要素７個。日曜=0,土曜=6、月曜始まりなら、[1,2,3,4,5,6,0]
const DOW_VECTOR = [];
const Today_RC = [];    // 今日のセル位置。後で使うのでグローバル。createCalender内でセットされる。
// scheduleの、theme_nameで、祝日を表すキーワード。暫定。別の手段にしたほうがよいかもしれない
const holiday_keyword = "国民の祝日";

// ユーザー取得。ログインなどを経て設定される。
// 今は未実装のため、取得したとして、テスト用の仮の値
USER_ID = 3;

// カレンダーテーブル
let thisMonthTable = document.getElementById("monthTable");
// MonthPicker
let monthPicker = document.getElementById("monthPicker");
// スケジュール入力ダイヤログ
const inputDialog = document.getElementById("inputDialog");

class CalDay {
  constructor(year, month, day, dow) {
    this.year = year;
    this.month = month;
    this.day = day;  
    // プログラム内では 0-6の数値で扱う
    // 表示するときは、DOW_KANJI[dow] とすると、漢字になる。 
    this.dow = dow; //day of week
    // カレンダーを表示するテーブル thisMonthTable の、行位置と列位置。createCalender内でセットされる。 
    this.row = 0;
    this.col = 0;
  }

    dump() {
        return this.year + '/' + this.month + '/' + this.day + ' ' + this.dow;
    }
    writeCalDay() {
        document.getElementById("debugArea").innerHTML += this.dump() + '<br>';
    }
}

// left panel
function startTest() {
  let row = thisMonthTable.rows[1];
  let h_offset = row.offsetHeight;

  document.getElementById("result").textContent = "高さは、" + h_offset;
}

// 年月選択
// monthPicker で年月が選ばれたら反映
monthPicker.addEventListener("change", (e) => {
  let [year, month] = e.target.value.split("-");
  dispYEAR = year;
  dispMONTH = parseInt(month, 10);

  initializeCalender(dispYEAR, dispMONTH);
});
// 矢印で月を変更したときに、monthPickerの値も変えておくための関数
function updateMonthPickerValue(year, month) {
  // 月を2桁の文字列にフォーマット（例: 5 -> "05"）
  const formattedMonth = String(month).padStart(2, '0'); 
  monthPicker.value = `${year}-${formattedMonth}`;
}
// カレンダーアイコンがクリックされたら、monthPickerを出す
function monthChageClick(){
  monthPicker.showPicker();  
}
// 右矢印で、次の月へ
function goNextMonth(){
  if (dispMONTH == 12){
    dispYEAR++;
    dispMONTH = 1;
  } else {
    dispMONTH++;
  }
  initializeCalender(dispYEAR, dispMONTH);
  updateMonthPickerValue(dispYEAR, dispMONTH);
}
// 左矢印で前の月へ
function goPrevMonth(){
  if (dispMONTH == 1){
    dispYEAR--;
    dispMONTH = 12;
  } else {
    dispMONTH--;
  }
  initializeCalender(dispYEAR, dispMONTH);
  updateMonthPickerValue(dispYEAR, dispMONTH);
}

function initializeCalender(dispyear, dispmonth){
  // カレンダーの表示
  dispYearMonth( dispyear, dispmonth);    // カレンダーの上の、年月を表示
  ThisMonth_ARRAY = [];
  thisMonthTable.innerHTML = '';
  createCalender();   // thisMonth array を作る
  dispCalender();     // カレンダーを描画する
  fetchMonthSchedule();   // スケジュールをselectしてきて表示する
}

// 初期表示
initializeCalender(dispYEAR, dispMONTH);
