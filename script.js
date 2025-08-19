// 打字機效果
const introLines = [
  "AT OUR FUTURE FARM,",
  "EVERY LEAF TELLS A SUSTAINABLE STORY",
  "CLICK HERE TO DRAW SEEDLINGS",
  "TO UNVEIL THE IMPACT OF EVERY PLANT WE GROW"
];
const introText = document.getElementById("introText");
let lineIndex = 0;

function typeLine() {
  if (lineIndex >= introLines.length) {
    introText.addEventListener("click", startInteraction);
    return;
  }
  let line = introLines[lineIndex];
  let i = 0;
  let lineDiv = document.createElement("div");
  introText.appendChild(lineDiv);
  let interval = setInterval(() => {
    lineDiv.textContent += line[i];
    i++;
    if (i >= line.length) {
      clearInterval(interval);
      lineIndex++;
      setTimeout(typeLine, 800);
    }
  }, 80);
}
typeLine();

// 主互動變數
const mainStage = document.getElementById("mainStage");
const canvasContainer = document.getElementById("canvasContainer");
const restartBtn = document.getElementById("restartBtn");

let seedlings = [];
let plantsActive = [false, false, false];

// 設計解析度
const designWidth = 1920;
const designHeight = 1080;

// 開始互動
function startInteraction() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }

  introText.classList.add("hidden");
  mainStage.classList.remove("hidden");

  mainStage.addEventListener("click", placeSeedling);
}

// 放置 SEEDLING
function placeSeedling(e) {
  const rect = mainStage.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const choices = ["1.svg", "2.svg", "3.svg"];
  const widths = { "1.svg": 230, "2.svg": 255, "3.svg": 150 };
  const pick = choices[Math.floor(Math.random() * choices.length)];

  let img = document.createElement("img");
  img.src = `assets/Seedlings/${pick}`;
  img.style.position = "absolute";

  img.onload = () => {
    // 百分比縮放
    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;
    const widthPx = widths[pick] * scaleX;
    img.style.width = widthPx + "px";

    // 底部貼齊
    const groundY = window.innerHeight;
    img.style.left = (x - widthPx / 2) + "px";
    img.style.top = (groundY - img.height) + "px";
  };

  canvasContainer.appendChild(img);
  seedlings.push({ x, zone: getZone(x) });

  if (seedlings.length === 3) startBackgroundAnimation();
  checkPlants();
}

// 背景動畫：雲 & 水滴
function startBackgroundAnimation() {
  const clouds = [
    { file: "1.svg", x: 150, y: 190, w: 250, minX: 120, maxX: 190 },
    { file: "2.svg", x: 610, y: 210, w: 340, minX: 580, maxX: 650 },
    { file: "3.svg", x: 970, y: 200, w: 175, minX: 950, maxX: 1000 },
    { file: "4.svg", x: 1325, y: 190, w: 250, minX: 1300, maxX: 1350 },
    { file: "5.svg", x: 1650, y: 200, w: 230, minX: 1630, maxX: 1670 },
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
    { file: "1.svg", x: 101, y: 435, w: 50 },
    { file: "2.svg", x: 695, y: 550, w: 50 },
    { file: "3.svg", x: 985, y: 390, w: 80 },
    { file: "4.svg", x: 1115, y: 500, w: 50 },
    { file: "5.svg", x: 1675, y: 360, w: 50 },
    { file: "6.svg", x: 1820, y: 480, w: 70 },
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

// 雲動畫（來回飄）
function animateCloud(img, cloud, scaleX) {
  let dir = 1;
  setInterval(() => {
    let left = parseFloat(img.style.left);
    left += dir * 0.3;
    if (left > cloud.maxX * scaleX || left < cloud.minX * scaleX) dir *= -1;
    img.style.left = left + "px";
  }, 30);
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
    { file: "1.svg", x: 400, w: 655 },
    { file: "2.svg", x: 920, w: 540 },
    { file: "3.svg", x: 1530, w: 700 },
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

// SAVE & RESTART
restartBtn.addEventListener("click", () => {
  html2canvas(document.body).then(canvas => {
    let link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL();
    link.click();

    window.location.reload();
  });
});