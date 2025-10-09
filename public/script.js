dispArea = document.getElementById("dispArea");
dispArea.innerHTML = "<h2>Hey!!</h2>";

async function myget() {
    dispArea.innerHTML = 'Loading...';
    try {
        const res = await fetch('/myget');
        if (!res.ok) {
            throw new Error('APIエラー: ' + res.status);
        }
        const data = await res.json();
        if (!data.users || data.users.length === 0) {
            dispArea.innerHTML = 'データがありません。';
            return;
        }
        // HTMLテーブル生成
        let html = '<h2>Users Table</h2><table border="1"><tr><th>ID</th><th>Name</th><th>Age</th></tr>';
        data.users.forEach(user => {
            html += `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.age}</td></tr>`;
        });
        html += '</table>';
        dispArea.innerHTML = html;
    } catch (err) {
        dispArea.innerHTML = 'エラー: ' + err.message;
    }
}
