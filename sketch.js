//연타게임

let gameStage = 1; // 스테이지 1로 시작
let gaugeValue = 0; // 게이지의 초기값
let targetGaugeValue = 200; // 특정 값 넘을 때의 목표 게이지 값
let decreaseRate = 2; // 게이지 감소 속도
let timeLimit = 10; // 타임 어택 시간 제한 (초)
let timeLimit2 = 10; // 스테이지2 타임 어택 시간 제한 (초)
let startTime; // 게임 시작 시간
let buttonPressed = false; // 버튼이 눌렸는지 여부

//팩맨게임

let player;
let items = [];
let villains = [];
let lives = 3;
let roads = [];

// 버튼 색상 관련 변수
let buttonColor = [0, 255, 0]; // 초록색
let buttonPressedColor = [255, 0, 0]; // 빨간색 (눌렸을 때의 색상)

function setup() {
  createCanvas(980, 530);
  
  //팩맨게임
  player = createPlayer();
  createItems(10); // 생성되는 아이템값
}

function draw() {
  background(220);

  switch (gameStage) {
    case 1:
      // 스테이지 1: 연타 게임
      if (!startTime && buttonPressed) {
        startTime = millis(); // 게임 시작 시간 기록
      }

      let isButtonPressed = isMouseOverButton(100, 200, 150, 50);

      // 버튼 색상 설정
      let currentButtonColor = isButtonPressed ? buttonPressedColor : buttonColor;

      drawButton(100, 200, 150, 50, currentButtonColor);

      // 게이지 표시
      fill(0);
      textSize(20);
      text("게이지: " + gaugeValue, 20, 20);

      if (startTime !== undefined) {
      
      // 시간 경과 계산
      let elapsedTime = (millis() - startTime) / 1000; // 밀리초를 초로 변환

      // 타임 어택 실패 조건
      if (elapsedTime >= timeLimit && gaugeValue <= targetGaugeValue) {
        gameStage = 2;
        // 스테이지 2에 대한 초기화 또는 화면 갱신 로직을 추가할 수 있습니다.
      } else {
        // 남은 시간을 소수점 이하 두 자리까지 표시
        let remainingTime = max(0, timeLimit - elapsedTime);
        fill(0);
        textSize(20);
        text("남은 시간: " + nf(floor(remainingTime), 0, 0) + " 초", 20, 50);
      }
      }
      
      
      // 게이지 감소 로직
      if (buttonPressed) {
        gaugeValue = max(0, gaugeValue - decreaseRate*0.5);
      }
      
      break;

    case 2:
      // 실패-설명
      fill(255, 0, 0); // 빨간색 텍스트
      textSize(30);
      text("당신의 목소리만으로는 상사를 설득시키지 못했습니다.", width / 2, height / 2);
      break;

    case 3:
      // 실패-연결대사
      fill(0);
      textSize(30);
      text("나 혼자의 힘만으로는 어렵구나. 나와 한목소리를 낼 동료를 모아 노조를 결성해야겠다!", width / 2, height / 2);
      break;

    case 4:
      // 성공-설명
      fill(0);
      textSize(30);
      text("상사가 웃으며 당신을 배웅합니다! 그런데 몇 달이 지나도 당신이 일하는 환경에는 아무런 변화가 없습니다.", width / 2, height / 2);
      break;
      
    case 5:
      // 성공-연결대사
      fill(0);
      textSize(30);
      text("나 혼자의 힘만으로는 어렵구나. 나와 한목소리를 낼 동료를 모아 노조를 결성해야겠다!", width / 2, height / 2);
      break;
      
    case 6:
      //스테이지2 : 팩맨게임
      
      handleGame();
      drawLives();
      
      if (!startTime && keyPressed) {
        startTime = millis(); // 게임 시작 시간 기록
      }
      
      if (startTime !== undefined) {
      
      // 시간 경과 계산
      let elapsedTime = (millis() - startTime) / 1000; // 밀리초를 초로 변환

      // 타임 어택 내 목표 아이템값 못 채우면 실패
      if (elapsedTime >= timeLimit2 && items.length > 0) {
        gameStage = 7;
                
      } else {
        // 남은 시간을 소수점 이하 두 자리까지 표시
        let remainingTime = max(0, timeLimit2 - elapsedTime);
        fill(0);
        textSize(20);
        text("남은 시간: " + nf(floor(remainingTime), 0, 0) + " 초", 20, 50);
      } 
        
      }
      
        fill(0);
        textSize(20);
        text("획득한 아이템 수: " + (10 - items.length) + "/10", 20, 80);
      
      break;
      
    case 7:
      // 실패-설명2
      fill(0);
      textSize(30);
      text("당신은 노조를 결성할 수 있었지만, 목표한 수 만큼의 동료들을 설득하지는 못했습니다.", width / 2, height / 2);
      break;
      
    case 8:
      // 실패-연결대사2
      fill(0);
      textSize(30);
      text("과연 이 정도 인원만으로 교섭을 성공시킬 수 있을까? 걱정되지만 최선을 다하자!", width / 2, height / 2);
      break;
      
    case 9:
      // 성공-설명2
      fill(0);
      textSize(30);
      text("당신은 목표 인원수를 모으는 데 성공했습니다! 어? 그런데 동료가 노조의 인원이 너무 적은 것 같다며 걱정하네요...", width / 2, height / 2);
      break;
      
    case 10:
      // 성공-연결대사2
      fill(0);
      textSize(30);
      text("과연 이 정도 인원만으로 교섭을 성공시킬 수 있을까? 걱정되지만 최선을 다하자!", width / 2, height / 2);
      break;
      
    case 11:
      // 바구니 게임
      
      break;
      
    case 12:
      // 실패-설명3
      fill(0);
      textSize(30);
      text("사측과의 교섭 과정에서 노조의 요구사항이 받아들여지지 않았습니다.", width / 2, height / 2);
      break;
      
    case 13:
      // 성공-설명3
      fill(0);
      textSize(30);
      text("사측이 노조의 요구사항 중 일부를 수용했습니다! 하지만 정작 정말 필요했던 내용은 받아들여지지 않았네요...이제 어떻게 해야 할까요...??", width / 2, height / 2);
      break;
      
    case 14:
      // 아웃트로
      fill(0);
      textSize(30);
      text("과연 이 정도 인원만으로 교섭을 성공시킬 수 있을까? 걱정되지만 최선을 다하자!", width / 2, height / 2);
      break;
      
  }

}

function mousePressed() {
  if (gameStage === 1 && isMouseOverButton(100, 200, 150, 50)) {
    // 연타 게임 버튼 클릭 시 게이지 증가
    gaugeValue += 10;

    // 특정 게이지 값을 넘으면 다음 스테이지로 전환
    if (gaugeValue >= targetGaugeValue) {
      gameStage = 4;
    }

    buttonPressed = true;
  }
}

function drawButton(x, y, width, height, color) {
  fill(color);
  rect(x, y, width, height);
  fill(0);
  textSize(20);
  text("버튼", x + 20, y + 30);
}

function isMouseOverButton(x, y, width, height) {
  return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
}

function createPlayer() {
  return {
    x: width / 2,
    y: height - 30,
    radius: 15,
    show: function () {
      fill(0, 255, 0);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    },
    
    intersects: function (other) {
      let d = dist(this.x, this.y, other.x, other.y);
      return d <= this.radius + other.radius;
    },
    
    move: function (dirX, dirY) {
      this.x += dirX * 10;
      this.y += dirY * 10;
      this.x = constrain(this.x, this.radius, width - this.radius);
      this.y = constrain(this.y, this.radius, height - this.radius);
    },
  };
}

function createItems(count) {
  for (let i = 0; i < count; i++) {
    items.push({
      x: random(width),
      y: random(height - 50),
      radius: 10, // 아이템 크기
      show: function () {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
      },
    });
  }
}

function handleGame() {
  player.show();
  handlePlayerMovement();

  handleItems();
  handleVillains();
  
  if (items.length === 0) {
    gameStage = 9; // 성공 설명 페이지
    redraw(); // 성공 페이지에 도달하면 화면을 갱신하여 성공 메시지를 표시
  }

  if (lives <= 0) {
    gameStage = 7; // 실패 설명 페이지
    redraw(); // 실패 페이지에 도달하면 화면을 갱신하여 실패 메시지를 표시
  }
}

function handlePlayerMovement() {
  let dirX = 0;
  let dirY = 0;

  if (keyIsDown(LEFT_ARROW)) {
    dirX = -1;
  } else if (keyIsDown(RIGHT_ARROW)) {
    dirX = 1;
  }

  if (keyIsDown(UP_ARROW)) {
    dirY = -1;
  } else if (keyIsDown(DOWN_ARROW)) {
    dirY = 1;
  }
  
  player.move(dirX, dirY);
}

function handleItems() {
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].show();
    if (player.intersects(items[i])) {
      items.splice(i, 1);
    }
  }
}

function drawLives() {
  textSize(18);
  fill(0);
  text(`Lives: ${lives}`, 20, 20);
}

function createVillain() {
  return {
    x: width, // 오른쪽 끝에서 생성
    y: random(height - 50),
    radius: 30, // 빌런 크기
    show: function () {
      fill(0);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    },
    move: function () {
      this.x -= 15; // 왼쪽으로 이동
    },
  };
}

function handleVillains() {
  // 프레임당 2%의 확률로 빌런 생성
  if (random(0, 1) < 0.02) {
    villains.push(createVillain());
  }

  for (let i = villains.length - 1; i >= 0; i--) {
    villains[i].show();
    villains[i].move();

    if (player.intersects(villains[i])) {
      lives--;
      villains.splice(i, 1);
    }
  }
}


function keyPressed() {
  if (keyCode === ENTER) {
    gameStage += 1; // 실패 메시지 페이지로 이동
    redraw(); // 실패 페이지에 도달하면 화면을 갱신하여 실패 메시지를 표시
  }
}