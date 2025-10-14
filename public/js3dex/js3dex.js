import * as THREE from "./three/three.module.js";
import { OrbitControls } from "./three/OrbitControls.js";

// 制御用ボタンなど
document.getElementById("startButton").onclick = () => {
    animating = true;
    startTime = null;
};
document.getElementById("resetButton").onclick = () => {
    animating = false;
    startTime = null;
    // 頂点座標を「開始位置」に戻す
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < pos.length; i++) {
        pos[i] = startVertices[i];
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera); // 即時反映
};

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
    55,         // 視野角
    window.innerWidth / window.innerHeight,     // アスペクト比
    0.1,        // これ以上近いとレンダリングしない
    1000        // これ以上遠いとレンダリングしない
);
const cameraPosDiv = document.getElementById("cameraPos");

// 視野角とz方向の距離は関係がある。視野角と距離の組み合わせ例
// (55,20)、(45,25)、(75,15) 
// 視野角が小さいほど寄った感じ、大きいほど離れた感じになるのかな。
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 初期座標
const startVertices = new Float32Array([
    -1, -4, 0,   // v0
     1, -4, 0,   // v1
     1, 0, 0,    // v2 
    -1, 0, 0     // v3 
]);

// 頂点ごとの色（R,G,B）
const colors = new Float32Array([
    1, 0, 0,   // v0: 赤
    1, 1, 0,   // v1: 黄
    0, 1, 0,   // v2: 緑
    0, 0, 1    // v3: 青
]);

//目標座標

// // 肩を斜め前(30度)に傾けながら90度回し、腰も30度前傾しながら45度回す
// // 0.67 = sin(π/3)cos(π/4) = sin(π/3)sin(π/4), 0.5 = cos(π/3)
const endVertices = new Float32Array([
    -0.67, -3.5, -0.67,   // v0  
     0.67, -4.5, 0.67,   // v1  
     0, -0.5, 0.87,    // v2  
     0, 0.5, -0.87    // v3 
]);
// // 肩を斜め前(30度)に傾けながら90度回す
// // 0.87 = √3 / 2
// const endVertices = new Float32Array([
//     -1, -4, 0,   // v0  固定
//      1, -4, 0,   // v1  固定
//      0, -0.5, 0.87,    // v2  
//      0, 0.5, -0.87    // v3 
// ]);
// //腰を45度、肩は90度水平に回す
// const endVertices = new Float32Array([
//     -0.71, -4,  -0.71,   // v0 
//      0.71, -4,  0.71,   // v1 
//      0,  0,  1,   // v2 
//      0,  0, -1    // v3 
// ]);
// // 単純に肩だけ水平に90度回す
// const endVertices = new Float32Array([
//     -1, -4, 0,   // v0  固定
//      1, -4, 0,   // v1  固定
//      0, 0, 1,    // v2  
//      0, 0, -1    // v3 
// ]);

// ジオメトリ
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(startVertices.slice(), 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
geometry.setIndex([0,1, 1,2, 2,3, 3,0]);

// 線
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const lines = new THREE.LineSegments(geometry, lineMaterial);
scene.add(lines);

// 頂点を赤い点
const pointMaterial = new THREE.PointsMaterial({ 
    size: 0.2,
    vertexColors: true  // 頂点ごとの色を有効化
});
const points = new THREE.Points(geometry, pointMaterial);
scene.add(points);

// 軸表示 x軸：赤、y軸：緑、z軸：青
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, -2, 0);  // 長方形の下辺を回転中心に

// アニメーション制御用
let animating = false;
let startTime = null;
const duration = 2000; // 2秒かけて変形

// レンダリングループ（常に回す）
function renderLoop() {
    requestAnimationFrame(renderLoop);
    controls.update();
    renderer.render(scene, camera);

    // カメラ位置の表示
    const { x, y, z } = camera.position;
    const { x: xt, y: yt, z: zt } = controls.target;
    cameraPosDiv.textContent =
      `Camera: x=${x.toFixed(2)} y=${y.toFixed(2)} z=${z.toFixed(2)}\n` +
      `Target:(${xt.toFixed(2)},${yt.toFixed(2)},${zt.toFixed(2)})`;

    // 変形アニメーション中なら補間計算
    if (animating) {
        const now = performance.now();
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        const pos = geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i++) {
            pos[i] = startVertices[i] * (1 - t) + endVertices[i] * t;
        }
        geometry.attributes.position.needsUpdate = true;

        if (t >= 1) {
            animating = false; // 終了
            startTime = null;
        }
    }
}
renderLoop();

