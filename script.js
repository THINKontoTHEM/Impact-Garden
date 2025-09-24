// === 開場動畫控制（取代原本的打字機 introLines 版本） ===
const startScreen = document.querySelector(".start-screen");
const openingScene = document.querySelector(".opening-scene");
const textEl = document.querySelector(".opening-text");

// 主互動變數
const mainStage = document.getElementById("mainStage");
const canvasContainer = document.getElementById("canvasContainer");
const restartBtn = document.getElementById("restartBtn");
const introText = document.getElementById("introText"); // 保留相容

let seedlings = [];
let plantsActive = [false, false, false];

let textFinished = false;

// 第一次點擊：進入全螢幕 + 顯示開場字幕（打字機）
document.body.addEventListener("click", async () => {
  if (startScreen && startScreen.style.display !== "none") {
    if (document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch (e) {}
    }
    // 顯示開場字幕
    startScreen.style.display = "none";
    if (openingScene) openingScene.style.display = "flex";

    const text = `AT OUR FUTURE FARM,\nEVERY LEAF TELLS A <span class="highlight">SUSTAINABLE STORY.</span>`;
    textEl.innerHTML = "";
    let i = 0;
    const typer = setInterval(() => {
      textEl.innerHTML = text.substring(0, i) + (i < text.length ? "|" : "");
      i++;
      if (i > text.length) {
        clearInterval(typer);
        textFinished = true;
      }
    }, 50);
    return;
  }

  // 第二次點擊：字幕結束後，淡出字幕 → 進入互動
  if (textFinished && openingScene && openingScene.style.display !== "none") {
    openingScene.style.transition = "opacity 1s";
    openingScene.style.opacity = "0";
    setTimeout(() => {
      openingScene.style.display = "none";

      if (typeof startInteraction === "function") {
        startInteraction();
      } else {
        mainStage && mainStage.classList.remove("hidden");
      }
    }, 1000);
  }
});

// === 設計解析度 ===
const designWidth = 1920;
const designHeight = 1080;

// 開始互動
function startInteraction() {
  // 再次保險，若還沒全螢幕則請求
  if (document.documentElement.requestFullscreen) {
    try { document.documentElement.requestFullscreen(); } catch (e) {}
  }

  introText && introText.classList.add("hidden");
  mainStage.classList.remove("hidden");

  mainStage.addEventListener("click", placeSeedling);
}


// ✅ 預加載圖片
const seedlingCache = {};
["1.svg", "2.svg", "3.svg", "4.svg", "5.svg"].forEach(file => {
  const img = new Image();
  img.src = `assets/Seedlings/${file}`;
  seedlingCache[file] = img;
});

// ✅ 放置 SEEDLING
function placeSeedling(e) {
  const rect = mainStage.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const choices = ["1.svg", "2.svg", "3.svg", "4.svg", "5.svg"];
  const widths = { "1.svg": 132, "2.svg": 155, "3.svg": 102, "4.svg": 152, "5.svg": 102 };
  const pick = choices[Math.floor(Math.random() * choices.length)];

  let img = seedlingCache[pick].cloneNode(); // 用緩存好的圖
  img.style.position = "absolute";

  // 📐 用比例算高度，避免 img.height = 0 的問題
  const scaleX = window.innerWidth / designWidth;
  const widthPx = widths[pick] * scaleX;

  const aspect = seedlingCache[pick].naturalHeight / seedlingCache[pick].naturalWidth;
  const heightPx = widthPx * aspect;

  img.style.width = widthPx + "px";
  img.style.height = heightPx + "px";

  // 底部貼齊
  const groundY = window.innerHeight;
  img.style.left = (x - widthPx / 2) + "px";
  img.style.top = (groundY - heightPx) + "px";

  canvasContainer.appendChild(img);
  seedlings.push({ x, zone: getZone(x) });

  if (seedlings.length === 3) startBackgroundAnimation();
  checkPlants();
}


// 背景動畫：雲 & 水滴
function startBackgroundAnimation() {
  const clouds = [
    { file: "1.svg", x: 149, y: 45, w: 374, minX: 90, maxX: 170 },
    { file: "2.svg", x: 684, y: 110, w: 205, minX: 615, maxX: 695 },
    { file: "3.svg", x: 1071, y: 59, w: 299, minX: 1060, maxX: 1141 },
    { file: "4.svg", x: 1580, y: 60, w: 205, minX: 1540, maxX: 1620 },
  ];
  clouds.forEach((c, i) => {
    let img = document.createElement("img");
    img.src = `assets/Clouds/${c.file}`;
    img.style.position = "absolute";
    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;
    img.style.width = (c.w * scaleX) + "px";
    img.style.left = (c.x * scaleX) + "px";
    img.style.top = (c.y * scaleY) + "px";
    canvasContainer.appendChild(img);

    animateCloud(img, c, scaleX);
  });

  const drips = [
    { file: "1.svg", x: 85, y:220, w: 36 },
    { file: "2.svg", x: 247, y: 287, w: 60 },
    { file: "3.svg", x: 367, y: 384, w: 36 },
    { file: "4.svg", x: 463, y: 269, w: 30 },
    { file: "5.svg", x: 552, y: 597, w: 30 },
    { file: "6.svg", x: 536, y: 270, w: 157 },
    { file: "7.svg", x: 954.5, y: 258, w: 66 },
    { file: "8.svg", x: 1257.5, y: 266, w: 120 },
    { file: "9.svg", x: 1467, y: 233, w: 30 },
    { file: "10.svg", x: 1626, y: 240, w: 80 },
    { file: "11.svg", x: 1799, y: 258, w: 36 },
  ];
  drips.forEach((d, i) => {
    let img = document.createElement("img");
    img.src = `assets/Drips/${d.file}`;
    img.style.position = "absolute";
    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;
    img.style.width = (d.w * scaleX) + "px";
    img.style.left = (d.x * scaleX) + "px";
    img.style.top = (d.y * scaleY) + "px";
    canvasContainer.appendChild(img);

    animateDrip(img, i);
  });
}

// 雲動畫（隨機速度 + 區間內來回飄）
function animateCloud(img, cloud, scaleX) {
  // 隨機初始方向（1: 向右, -1: 向左）
  let dir = Math.random() < 0.5 ? -1 : 1;
  // 隨機速度（0.1 ~ 0.5 像素/幀）
  let speed = 0.1 + Math.random() * 0.4;

  function step() {
    let left = parseFloat(img.style.left) || cloud.minX * scaleX;
    left += dir * speed;

    // 到達邊界就反轉方向 & 隨機新速度
    if (left > cloud.maxX * scaleX) {
      left = cloud.maxX * scaleX;
      dir = -1;
      speed = 0.1 + Math.random() * 0.4;
    } else if (left < cloud.minX * scaleX) {
      left = cloud.minX * scaleX;
      dir = 1;
      speed = 0.1 + Math.random() * 0.4;
    }

    img.style.left = left + "px";
    requestAnimationFrame(step);
  }

  step();
}

// 水滴動畫
function animateDrip(img, i) {
  setInterval(() => {
    img.style.opacity = img.style.opacity === "0" ? "1" : "0";
  }, 2000 + i * 300);
}

// 檢查 PLANT 激活
function getZone(x) {
  const width = window.innerWidth;
  if (x < width / 3) return 0;
  if (x < (2 * width) / 3) return 1;
  return 2;
}

function checkPlants() {
  [0, 1, 2].forEach(zone => {
    const count = seedlings.filter(s => s.zone === zone).length;
    if (count >= 2 && !plantsActive[zone]) {
      showPlant(zone);
      plantsActive[zone] = true;
    }
  });

  if (plantsActive.every(v => v)) restartBtn.classList.remove("hidden");
}

// 顯示 Plant
function showPlant(zone) {
  const plants = [
    { file: "1.svg", x: 271.5, w: 498 },
    { file: "2.svg", x: 946.5, w: 547.5 },
    { file: "3.svg", x: 1565.5, w: 615 },
  ];
  const p = plants[zone];

  let img = document.createElement("img");
  img.src = `assets/Impact/${p.file}`;
  img.style.position = "absolute";

  const scaleX = window.innerWidth / designWidth;
  const scaleY = window.innerHeight / designHeight;
  img.style.width = (p.w * scaleX) + "px";
  img.style.left = (p.x * scaleX - (p.w * scaleX) / 2) + "px";
  img.style.top = window.innerHeight + "px"; // start off screen
  canvasContainer.appendChild(img);

  img.onload = () => {
    const target = window.innerHeight - img.height; // 底部貼齊
    let pos = window.innerHeight;
    let interval = setInterval(() => {
      pos -= 5;
      img.style.top = pos + "px";
      if (pos <= target) clearInterval(interval);
    }, 30);
  };
}


// RESTART
restartBtn.addEventListener("click", () => {
  window.location.reload();

});