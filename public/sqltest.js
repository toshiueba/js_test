async function fetchData(){
    const resultArea = document.getElementById('resultArea');
    const backBtn = document.getElementById('backBtn');

    backBtn.addEventListener('click', () => {
    location.href = 'index.html';
    });

    try {
    const res = await fetch('/sqltest');
    if (!res.ok) throw new Error('APIエラー: ' + res.status);
    const data = await res.json();
    if (!data.users || data.users.length === 0) {
        resultArea.innerHTML = 'データがありません。';
        return;
    }
    let html = '<table border="1"><tr><th>ID</th><th>Name</th><th>Age</th></tr>';
    data.users.forEach(u => {
        html += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.age}</td></tr>`;
    });
    html += '</table>';
    resultArea.innerHTML = html;
    } catch (err) {
    resultArea.innerHTML = 'エラー: ' + err.message;
    }
}