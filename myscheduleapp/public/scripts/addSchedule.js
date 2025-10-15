// スケジュールを追加する
function addSchedule( dateStr ){
  document.getElementById("inputModal").style.display = "flex";
  const newTitle = document.getElementById("newTitle");
  const allDayCheckbox = document.getElementById("allDay");
  const startTimeInput = document.getElementById("newStartTime");
  const endTimeInput = document.getElementById("newEndTime");
  // 初期化
  document.getElementById("newSchedTargetDate").textContent = dispYEAR + '年' + dispMONTH + '月' + dateStr + '日';
  newTitle.value = ""; 
  allDayCheckbox.checked = false;
  // 開始・終了時刻を現在時刻で初期化
  // その時刻の00分 で初期化する。日付をまたぐ場合の考慮は後で。
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  // とりあえず、23時とかは、ほっとく
  const e_hours = (parseInt(hours) + 1).toString().padStart(2, '0');
  // const minutes = now.getMinutes().toString().padStart(2, '0');
  const minutes = '00';
  startTimeInput.disabled = false;
  endTimeInput.disabled = false;
  startTimeInput.value = `${hours}:${minutes}`; 
  endTimeInput.value = `${e_hours}:${minutes}`; 

  // 終日がチェックされたとき、外されたとき
  allDayCheckbox.addEventListener("change", () => {
    if (allDayCheckbox.checked) {
      // 終日がON → 00:00にリセット
      startTimeInput.value = "00:00";
      endTimeInput.value = "00:00";
      // 時刻入力を無効化
      startTimeInput.disabled = true;
      endTimeInput.disabled = true;
    } else {
      // チェック解除 → 時刻入力を再び使えるようにする
      startTimeInput.disabled = false;
      endTimeInput.disabled = false;
    }
  });

  // タイトルにフォーカス
  newTitle.focus();
}

function closeModal() {
  document.getElementById("inputModal").style.display = "none";
}

function submitInput() {
  let nt = document.getElementById("newTitle").value;
  let st = document.getElementById("newStartTime").value;
  let et = document.getElementById("newEndTime").value;

  alert("タイトル = " + nt + "\n開始時刻" + st + "\n終了時刻" + et);

  closeModal(); // 入力後に閉じる
}
