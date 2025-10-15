async function fetchData(){
    const resultArea = document.getElementById('resultArea');
    const backBtn = document.getElementById('backBtn');

    backBtn.addEventListener('click', () => {
        location.href = '../index.html';
    });

    try {
        const response = await fetch('/api/user_all_schedule');
        const data = await response.json();
        // テーブル生成
        let html = "<table><tr><th>ID</th><th>Title</th><th>Start Time</th><th>Flag</th></tr>";
        data.forEach(row => {
        html += `<tr>
                    <td>${row.schedule_id}</td>
                    <td>${row.title}</td>
                    <td>${formatDate(row.start_time)}</td>
                    <td>${formatDate(row.start_time)}</td>
                </tr>`;
        });
        html += "</table>";
        resultArea.innerHTML = html;
    } catch (err) {
        resultArea.innerHTML = 'エラー: ' + err.message;
    }
}