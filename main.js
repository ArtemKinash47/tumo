function setup() {
  createCanvas(400, 400);
  Game.addCommonBalloon();
}

function draw() {
  background('grey');

  for (let balloon of Game.balloons) {
    balloon.display();
    balloon.move(Game.score);

    if (balloon.y < 25 && balloon.constructor.name != 'AngryBalloon') {
      noLoop();
      clearInterval(interval);
      Game.balloons.length = 0;
      background(136, 220, 166);
      let finalScore = Game.score;
      Game.score = '';
      textSize(64);
      fill('white');
      textAlign(CENTER, CENTER);
      text('FINISH', 200, 200);
      textSize(34);
      text('Score: ' + finalScore, 200, 300);
    }
  }

  textSize(32);
  fill('black');
  text(Game.score, 30, 40);

  if (frameCount % 50 === 0) {
    Game.addCommonBalloon();
  }
  if (frameCount % 100 === 0) {
    Game.addUniqBalloon();
  }
  if (frameCount % 150 === 0) {
    Game.addAngryBalloon();
  }

  if (frameCount % 500 === 0) {
    Game.addExtrBalloon()
  }
}

function mousePressed() {
  if (!isLooping()) {
    loop();
    interval = setInterval(() => {
      Game.sendStatistics();
    }, 5000);
    Game.score = 0;
  }

  Game.checkIfBalloonBurst();
}

let interval = setInterval(() => {
  Game.sendStatistics();
}, 5000);

class Game {
  static balloons = [];
  static commonCount = 0;
  static uniqCount = 0;
  static angryCount = 0;
  static extrCount = 0;
  static score = 0;

  static addCommonBalloon() {
    let commonBalloon = new CommonBalloon('blue', 50);
    this.balloons.push(commonBalloon);
  }

  static addUniqBalloon() {
    let uniqBalloon = new UniqBalloon('green', 30);
    this.balloons.push(uniqBalloon);
  }

  static addAngryBalloon() {
    let angryBalloon = new AngryBalloon('black', 50);
    this.balloons.push(angryBalloon);
  }

  static addExtrBalloon() {
    let exball = new ExBall("purple", 60)
    this.balloons.push(exball)
  }



  static checkIfBalloonBurst() {
    this.balloons.forEach((balloon, index) => {
      let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
      if (distance <= balloon.size / 2) {
        balloon.burst(index);
      }
    });
  }

  static sendStatistics() {
    let statistics = {
      commonBurst: this.commonCount,
      uniqBurst: this.uniqCount,
      angryBurst: this.angryCount,
      extrCount: this.extrCount,
      score: this.score,
    };

    fetch('/statistic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statistics),
    });
  }
}

class CommonBalloon {
  constructor(color, size) {
    this.x = random(width);
    this.y = random(height - 10, height + 50);
    this.color = color;
    this.size = size;
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
  }

  move(score) {
    if (score < 100) {
      this.y -= 1;
    } else if (score > 100 && score < 200) {
      this.y -= 1.5;
    } else this.y -= 2;
  }

  burst(index) {
    Game.balloons.splice(index, 1);
    Game.score += 1;
    Game.commonCount += 1;
  }
}

class UniqBalloon extends CommonBalloon {
  constructor(color, size) {
    super(color, size);
  }

  burst(index) {
    Game.balloons.splice(index, 1);
    Game.score += 10;
    Game.uniqCount += 1;
  }
}

class AngryBalloon extends CommonBalloon {
  constructor(color, size) {
    super(color, size);
  }

  burst(index) {
    Game.balloons.splice(index, 1);
    Game.score -= 10;
    Game.angryCount += 1;
  }
}

class ExBall extends CommonBalloon {
  constructor(color, size) {
    super(color, size)
    this.x = 400
    this.y = 400
  }
  move(score) {
    if (score < 100) {
      this.y -= 5
      this.x -= 5
    } else if (score >= 100 && score <= 200) {
      this.y -= 6
      this.x -= 6
    } else {
      this.y -= 7
      this.x -= 7
    }
  }
  burst(index) {
    Game.balloons.splice(index, 1)
    Game.score += 20
    Game.extrCount += 1
  }
}