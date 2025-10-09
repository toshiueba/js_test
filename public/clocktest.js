const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        location.href = 'index.html';
    });
}

function drawClock(){
        const canvas = document.getElementById('clockCanvas');
        if (!canvas || !canvas.getContext) {
                alert('Canvas 非対応のブラウザです');
                return;
        }
        const ctx = canvas.getContext('2d');
        // prepare geometry and style
        const yOffset = -20; // 上に20px移動
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + yOffset;
        const radius = Math.min(canvas.width, canvas.height) * 0.35; // 少し大きめ
        const style = getComputedStyle(document.documentElement);

        // render static parts (background, circle, numbers)
        function renderStatic() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const canvasBg = style.getPropertyValue('--canvas-bg') || '#f0f0f0';
            const strokeFg = style.getPropertyValue('--stroke-fg') || '#555555';
            const strokeWidthCss = style.getPropertyValue('--stroke-width') || '3px';

            ctx.fillStyle = canvasBg.trim();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 円
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = parseFloat(strokeWidthCss) || 3;
            ctx.strokeStyle = strokeFg.trim();
            ctx.stroke();

            // numbers
            const clockNumberColor = style.getPropertyValue('--clock-number-color') || '#222222';
            const clockNumberFontSize = style.getPropertyValue('--clock-number-font-size') || '20px';
            const fontSize = parseInt(clockNumberFontSize, 10) || 20;
            ctx.fillStyle = clockNumberColor.trim();
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < 12; i++) {
                const hour = (i === 0) ? 12 : i;
                const angle = (Math.PI * 2) * (i / 12) - Math.PI / 2;
                const tx = centerX + Math.cos(angle) * (radius * 0.85);
                const ty = centerY + Math.sin(angle) * (radius * 0.85);
                ctx.fillText(String(hour), tx, ty);
            }
        }

        // draw hands based on current time
        function drawHands() {
            // re-render static so hands are drawn on clean base
            renderStatic();

            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            const hourAngle = (Math.PI * 2) * ((hours + minutes / 60 + seconds / 3600) / 12) - Math.PI / 2;
            const minuteAngle = (Math.PI * 2) * ((minutes + seconds / 60) / 60) - Math.PI / 2;

            const hourHandLength = radius * 0.6;
            const minuteHandLength = radius * 0.9;

            const hourHandColor = style.getPropertyValue('--hour-hand-color') || '#111111';
            const minuteHandColor = style.getPropertyValue('--minute-hand-color') || '#111111';
            const hourHandWidth = parseFloat(style.getPropertyValue('--hour-hand-width')) || 6;
            const minuteHandWidth = parseFloat(style.getPropertyValue('--minute-hand-width')) || 4;
            const secondHandColor = style.getPropertyValue('--second-hand-color') || '#d9534f';
            const secondHandWidth = parseFloat(style.getPropertyValue('--second-hand-width')) || 2;

            // hour hand
            ctx.beginPath();
            ctx.strokeStyle = hourHandColor.trim();
            ctx.lineWidth = hourHandWidth;
            ctx.lineCap = 'round';
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(hourAngle) * hourHandLength, centerY + Math.sin(hourAngle) * hourHandLength);
            ctx.stroke();

            // minute hand
            ctx.beginPath();
            ctx.strokeStyle = minuteHandColor.trim();
            ctx.lineWidth = minuteHandWidth;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(minuteAngle) * minuteHandLength, centerY + Math.sin(minuteAngle) * minuteHandLength);
            ctx.stroke();

            // seconds hand
            const secondAngle = (Math.PI * 2) * (seconds / 60) - Math.PI / 2;
            const secondHandLength = radius * 0.95;
            ctx.beginPath();
            ctx.strokeStyle = secondHandColor.trim();
            ctx.lineWidth = secondHandWidth;
            ctx.lineCap = 'round';
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(secondAngle) * secondHandLength, centerY + Math.sin(secondAngle) * secondHandLength);
            ctx.stroke();

            // center cap
            ctx.beginPath();
            ctx.fillStyle = hourHandColor.trim();
            ctx.arc(centerX, centerY, Math.max(4, hourHandWidth / 1.5), 0, Math.PI * 2);
            ctx.fill();

            // draw digital time inside canvas below the clock
            const y = now.getFullYear();
            const m = now.getMonth() + 1; // no zero pad
            const d = now.getDate(); // no zero pad
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            const weekdays = ['日','月','火','水','木','金','土'];
            const w = weekdays[now.getDay()];
            const digitalText = `${y}/${m}/${d}（${w}） ${hh}:${mm}:${ss}`;
            const digitalColor = style.getPropertyValue('--digital-color') || '#222222';
            const digitalFontSize = parseInt(style.getPropertyValue('--digital-font-size')) || 16;
            ctx.fillStyle = digitalColor.trim();
            ctx.font = `${digitalFontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const textY = centerY + radius + 30; // 10px below circle
            ctx.fillText(digitalText, centerX, textY);
        }

        // start: render once and set interval to update hands every second
        // avoid multiple timers
        if (window._clockInterval) {
            clearInterval(window._clockInterval);
            window._clockInterval = null;
        }
        // initial draw
        drawHands();
        // update every second
        window._clockInterval = setInterval(drawHands, 1000);
}

// load source files and display in right panel
async function loadSources(){
    const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    try{
        const [htmlRes, jsRes, cssRes] = await Promise.all([
            fetch('clocktest.html'),
            fetch('clocktest.js'),
            fetch('clocktest.css')
        ]);
        const [htmlTxt, jsTxt, cssTxt] = await Promise.all([htmlRes.text(), jsRes.text(), cssRes.text()]);
        const codeHtml = document.getElementById('src-html');
        const codeJs = document.getElementById('src-js');
        const codeCss = document.getElementById('src-css');
        codeHtml.textContent = htmlTxt;
        codeJs.textContent = jsTxt;
        codeCss.textContent = cssTxt;
        // highlight
        if (window.hljs) {
          hljs.highlightElement(codeHtml);
          hljs.highlightElement(codeJs);
          hljs.highlightElement(codeCss);
        }
    }catch(e){
        console.error('source load failed', e);
    }
}

window.addEventListener('load', loadSources);
