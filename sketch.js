let idleSprite; // 儲存角色一的待機精靈圖
let walkSprite; // 儲存角色一的走路精靈圖
let pushSprite; // 儲存角色一的推擊精靈圖
let magicSprite; // 儲存魔法特效精靈圖
let characterX = 0; // 儲存角色一目前的水平位置
let facingDirection = 1; // 記錄角色目前面向的方向
let isPushing = false; // 記錄角色是否正在播放推擊動畫
let pushStartFrame = 0; // 記錄推擊動畫開始時的畫面影格
let pushDirection = 1; // 記錄推擊動畫開始時角色面向的方向
let magicEffects = []; // 儲存目前畫面中的魔法特效
const idleFrameCount = 10; // 設定待機動畫的影格總數
const idleFrameWidth = 1395 / idleFrameCount; // 計算待機動畫每格的寬度
const idleFrameHeight = 196; // 設定待機動畫每格的高度
const walkFrameCount = 9; // 設定走路動畫的影格總數
const walkFrameWidth = 1246 / walkFrameCount; // 計算走路動畫每格的寬度
const walkFrameHeight = 198; // 設定走路動畫每格的高度
const pushFrameCount = 4; // 設定推擊動畫的影格總數
const pushFrameWidth = 1039 / pushFrameCount; // 計算推擊動畫每格的寬度
const pushFrameHeight = 146; // 設定推擊動畫每格的高度
const magicFrameCount = 5; // 設定魔法特效動畫的影格總數
const magicFrameWidth = 740 / magicFrameCount; // 計算魔法特效每格的寬度
const magicFrameHeight = 19; // 設定魔法特效每格的高度
const skyColor = '#87CEEB'; // 設定天空藍背景色
function preload() { // 在畫布建立前載入角色與特效圖片
  idleSprite = loadImage('1/stop/stop.png'); // 載入角色一的待機精靈圖
  walkSprite = loadImage('1/walk/walk.png'); // 載入角色一的走路精靈圖
  pushSprite = loadImage('1/push/push.png'); // 載入角色一的推擊精靈圖
  magicSprite = loadImage('1/magic/magic.png'); // 載入魔法特效精靈圖
} // 結束圖片載入函式
function setup() { // 設定畫布與繪圖模式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗尺寸的畫布
  imageMode(CORNER); // 使用圖片左上角作為繪製座標
  frameRate(10); // 設定動畫播放速度為每秒十格
  const initialScale = getCharacterScale(idleFrameWidth, idleFrameHeight); // 計算角色待機狀態的初始縮放比例
  characterX = (width * 2) / 3 - (idleFrameWidth * initialScale) / 2; // 將角色初始中心放在視窗寬度的三分之二處
} // 結束畫布設定函式
function getCharacterScale(spriteWidth, spriteHeight) { // 計算符合畫布尺寸的角色縮放比例
  return min((height * 0.4) / spriteHeight, (width * 0.35) / spriteWidth); // 依畫布高寬等比例縮放並限制角色顯示範圍
} // 結束角色縮放計算函式
function spawnMagicEffect(direction) { // 在角色前方建立朝指定方向移動的魔法特效
  const effectScale = getCharacterScale(magicFrameWidth, magicFrameHeight); // 計算符合畫布尺寸的特效縮放比例
  const effectWidth = magicFrameWidth * effectScale; // 計算特效顯示寬度
  const effectHeight = magicFrameHeight * effectScale; // 計算特效顯示高度
  const playerScale = getCharacterScale(idleFrameWidth, idleFrameHeight); // 計算角色待機狀態的縮放比例
  const playerWidth = idleFrameWidth * playerScale; // 計算角色待機狀態的顯示寬度
  const playerHeight = idleFrameHeight * playerScale; // 計算角色待機狀態的顯示高度
  const effectX = constrain(direction > 0 ? characterX + playerWidth : characterX - effectWidth, 0, width - effectWidth); // 將特效放在角色前方並限制於畫布內
  const effectY = height - playerHeight * 0.55 - effectHeight / 2; // 將特效放在角色身體前方
  magicEffects.push({ x: effectX, y: effectY, direction: direction }); // 將新特效加入畫面中的特效清單
} // 結束魔法特效建立函式
function drawMagicEffects() { // 更新並繪製所有正在移動的魔法特效
  const effectScale = getCharacterScale(magicFrameWidth, magicFrameHeight); // 取得目前畫布尺寸適用的特效縮放比例
  const effectWidth = magicFrameWidth * effectScale; // 計算特效顯示寬度
  const effectHeight = magicFrameHeight * effectScale; // 計算特效顯示高度
  for (let effectIndex = magicEffects.length - 1; effectIndex >= 0; effectIndex -= 1) { // 從清單尾端逐一更新特效以便安全移除
    const effect = magicEffects[effectIndex]; // 取得目前更新的特效
    effect.x += effect.direction * 12 * effectScale; // 依特效方向持續向前移動
    if (effect.x > width || effect.x + effectWidth < 0) { // 判斷特效是否已完全離開畫布
      magicEffects.splice(effectIndex, 1); // 移除已離開畫布的特效
      continue; // 略過已移除特效的繪製
    } // 結束特效離場判斷
    const effectFrame = floor(frameCount / 2) % magicFrameCount; // 循環播放魔法特效的五個影格
    if (effect.direction < 0) { // 判斷是否需要讓特效朝左方移動
      push(); // 暫存目前的繪圖座標狀態
      translate(effect.x + effectWidth, effect.y); // 將繪圖原點移至特效右上角
      scale(-1, 1); // 水平翻轉特效使其面向左方
      image(magicSprite, 0, 0, effectWidth, effectHeight, effectFrame * magicFrameWidth, 0, magicFrameWidth, magicFrameHeight); // 繪製朝左的目前特效影格
      pop(); // 還原繪圖座標狀態
    } else { // 處理朝右移動的特效
      image(magicSprite, effect.x, effect.y, effectWidth, effectHeight, effectFrame * magicFrameWidth, 0, magicFrameWidth, magicFrameHeight); // 繪製朝右的目前特效影格
    } // 結束特效方向判斷
  } // 結束所有特效更新迴圈
} // 結束魔法特效更新函式
function draw() { // 每一影格更新背景、角色與魔法特效
  background(skyColor); // 使用天空色清除畫布
  const movingRight = keyIsDown(RIGHT_ARROW); // 判斷是否按住鍵盤右鍵
  const movingLeft = keyIsDown(LEFT_ARROW); // 判斷是否按住鍵盤左鍵
  const inputDirection = movingRight ? 1 : movingLeft ? -1 : 0; // 取得目前方向鍵輸入並優先採用右鍵
  if (!isPushing && inputDirection !== 0) facingDirection = inputDirection; // 移動時更新角色持續面向的方向
  if (isPushing && frameCount - pushStartFrame >= pushFrameCount * 2) { // 判斷推擊動畫是否已完整播放一次
    isPushing = false; // 結束推擊動畫狀態
    spawnMagicEffect(pushDirection); // 依推擊時面向的方向發射魔法特效
  } // 結束推擊動畫完成判斷
  const isWalking = !isPushing && inputDirection !== 0; // 判斷角色是否正在行走
  const activeSprite = isPushing ? pushSprite : isWalking ? walkSprite : idleSprite; // 依角色狀態選擇推擊、走路或待機精靈圖
  const activeFrameCount = isPushing ? pushFrameCount : isWalking ? walkFrameCount : idleFrameCount; // 取得目前角色動畫的影格總數
  const activeFrameWidth = isPushing ? pushFrameWidth : isWalking ? walkFrameWidth : idleFrameWidth; // 取得目前角色動畫每格的寬度
  const activeFrameHeight = isPushing ? pushFrameHeight : isWalking ? walkFrameHeight : idleFrameHeight; // 取得目前角色動畫每格的高度
  const characterScale = getCharacterScale(activeFrameWidth, activeFrameHeight); // 取得目前角色狀態適用的縮放比例
  const displayWidth = activeFrameWidth * characterScale; // 計算目前角色影格顯示寬度
  const displayHeight = activeFrameHeight * characterScale; // 計算目前角色影格顯示高度
  const movementDirection = isWalking ? inputDirection : 0; // 推擊動畫播放期間停止角色移動
  characterX = constrain(characterX + movementDirection * 6 * characterScale, 0, max(0, width - displayWidth)); // 移動角色並限制在畫布左右邊界內
  const characterY = height - displayHeight; // 將角色圖片底部對齊畫布底部
  const currentFrame = isPushing ? min(floor((frameCount - pushStartFrame) / 2), pushFrameCount - 1) : frameCount % activeFrameCount; // 單次播放推擊動畫並循環其他動畫
  if (facingDirection < 0) { // 判斷角色是否面向左方
    push(); // 暫存目前的繪圖座標狀態
    translate(characterX + displayWidth, characterY); // 將繪圖原點移至角色右上角
    scale(-1, 1); // 水平翻轉角色使其面向左方
    image(activeSprite, 0, 0, displayWidth, displayHeight, currentFrame * activeFrameWidth, 0, activeFrameWidth, activeFrameHeight); // 繪製水平翻轉後的目前角色影格
    pop(); // 還原繪圖座標狀態
  } else { // 處理角色面向右方的狀態
    image(activeSprite, characterX, characterY, displayWidth, displayHeight, currentFrame * activeFrameWidth, 0, activeFrameWidth, activeFrameHeight); // 繪製目前的角色影格
  } // 結束角色方向判斷
  drawMagicEffects(); // 更新並繪製畫面中的魔法特效
} // 結束畫面更新函式
function keyPressed() { // 接收方向鍵與空白鍵按下事件
  if (keyCode === 32 && !isPushing) { // 判斷空白鍵是否啟動新的推擊動畫
    isPushing = true; // 開始播放推擊動畫
    pushStartFrame = frameCount; // 記錄推擊動畫開始的影格
    pushDirection = facingDirection; // 記錄推擊時角色面向的方向
    return false; // 避免空白鍵觸發瀏覽器頁面捲動
  } // 結束空白鍵處理
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false; // 避免方向鍵觸發瀏覽器頁面捲動
} // 結束鍵盤按下處理函式
function windowResized() { // 在視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗
  const activeWidth = isPushing ? pushFrameWidth : idleFrameWidth; // 取得視窗調整時角色目前影格的原始寬度
  const activeHeight = isPushing ? pushFrameHeight : idleFrameHeight; // 取得視窗調整時角色目前影格的原始高度
  characterX = constrain(characterX, 0, max(0, width - activeWidth * getCharacterScale(activeWidth, activeHeight))); // 將角色位置限制在調整後畫布的左右邊界內
} // 結束視窗尺寸調整函式
