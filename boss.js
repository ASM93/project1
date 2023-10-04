class Boss {
  constructor() {
    this.position = [];
    this.previousPosition = [];
    this.possibleWays = [];
    this.bestWay = [];
    this.speed = 1;
    this.attackSpeed = 1;
    this.life = 10;
    this.wave = 0;
    this.spells = [];
  }

  spawn(x, y, wave) {
    this.spells = [];
    this.position = [x, y];
    this.wave = wave;

    //Initializing 1st bossCard
    const bossCard = document.getElementById([this.position]);
    bossCard.className += " boss";
    bossCard.innerHTML = this.life;
  }

  calcBestWay(element) {
    let heroPosition = hero.position;
    let x = 0;
    let y = 0;
    // Randomly choose way
    let random = Math.round(Math.random() * 2) - 1;
    let random2 = 0;
    if (Math.round(Math.random()) === 0) {
      random = -1;
    } else {
      random = 1;
    }
    x = random;
    if (Math.abs(x) === 0) {
      y = random2;
    } else {
      y = 0;
    }

    // check Hero - don't pass through + Attack Hero !!
    if (
      heroPosition[0] === element.position[0] + x &&
      heroPosition[1] === element.position[1] + y
    ) {
      x = 0;
      y = 0;
      element.attack();
      return [x, y];
    }

    // Detect obstacles and return next position
    else {
      let obstacle = [...game.tree];
      for (let i = 0; i < game.boss.length; i++) {
        obstacle.push(game.boss[i].position);
      }
      for (let i = 0; i < game.gates.length; i++) {
        obstacle.push(game.gates[i]);
      }
      for (let i = 0; i < game.castle.length; i++) {
        obstacle.push(game.castle[i]);
      }

      let elFront = [element.position[0] + x, element.position[1] + y];
      let elFrontTest = false;
      let el1Side = [element.position[0] + y, element.position[1] + x];
      let el1SideTest = false;
      let el2Side = [element.position[0] - y, element.position[1] - x];
      let el2SideTest = false;

      for (let elCheck of obstacle) {
        if (elCheck[0] === elFront[0] && elCheck[1] === elFront[1]) {
          elFrontTest = true;
        }
        if (elCheck[0] === el1Side[0] && elCheck[1] === el1Side[1]) {
          el1SideTest = true;
        }
        if (elCheck[0] === el2Side[0] && elCheck[1] === el2Side[1]) {
          el2SideTest = true;
        }
      }

      if (
        elFrontTest === false &&
        JSON.stringify(elFront) !== JSON.stringify(element.previousPosition)
      ) {
        x = elFront[0] - element.position[0];
        y = elFront[1] - element.position[1];
      } else if (
        el1SideTest === false &&
        JSON.stringify(el1Side) !== JSON.stringify(element.previousPosition)
      ) {
        x = el1Side[0] - element.position[0];
        y = el1Side[1] - element.position[1];
      } else if (
        el2SideTest === false &&
        JSON.stringify(el2Side) !== JSON.stringify(element.previousPosition)
      ) {
        x = el2Side[0] - element.position[0];
        y = el2Side[1] - element.position[1];
      } else {
        x = 0;
        y = 0;
      }
    }

    return [x, y];
  }

  move(x, y) {
    let oldbossCard = document.getElementById([this.position]);
    oldbossCard.innerHTML = "";
    this.previousPosition = [];
    this.previousPosition = [this.position[0], this.position[1]];

    this.position[0] = this.position[0] + x;
    this.position[1] = this.position[1] + y;

    // Modify bossCard
    let newOldCard = oldbossCard.className.replace("boss", "");
    oldbossCard.className = newOldCard;
    let newbossCard = document.getElementById([this.position]);
    newbossCard.className += " boss";
    this.updateLife();
  }

  attack() {
    // Set less Life
    hero.life--;
    hero.updateData();

    // Skin attack

    let bossCard = document.getElementById([this.position]);
    let newOldCard = bossCard.className.replace("boss", "boss-attack");
    newOldCard += " boss-attack";
    bossCard.className = newOldCard;

    // Clear boss skin
    setTimeout(() => {
      let newOldCard2 = bossCard.className
        .replaceAll("boss-attack", "boss")
        .replaceAll(" ", "")
        .replaceAll("-attack", "")
        .replaceAll("boss", "");
      newOldCard2 += " boss";
      bossCard.className = newOldCard2;
    }, 150);
  }

  spell() {
    //Init boss
    let bossCard = document.getElementById(this.position);
    let oldClass = bossCard.className;
    bossCard.className += "-spell";

    // Clear boss skin
    setTimeout(() => {
      bossCard.className = oldClass;
    }, 100);

    let x = 0;
    let y = 0;

    let dirX = this.position[0] - this.previousPosition[0];
    let dirY = this.position[1] - this.previousPosition[1];

    x = dirX;
    y = dirY;

    // Init obstacle
    let obstacle = [...game.tree];
    for (let i = 0; i < game.gates.length; i++) {
      obstacle.push(game.gates[i]);
    }
    for (let i = 0; i < game.castle.length; i++) {
      obstacle.push(game.castle[i]);
    }

    // Create Spell
    let obstacleCheck = false;
    let spellPositionX = this.position[0] + x;
    let spellPositionY = this.position[1] + y;
    let spellDir = "";

    if (x === 1) {
      spellDir = "down";
    } else if (x === -1) {
      spellDir = "up";
    } else if (y === 1) {
      spellDir = "right";
    } else if (y === -1) {
      spellDir = "left";
    } else {
      spellDir = "up";
    }

    for (let element of obstacle) {
      if (element[0] === spellPositionX && element[1] === spellPositionY) {
        obstacleCheck = true;
      }
    }

    if (obstacleCheck === false) {
      this.spells.push([spellPositionX, spellPositionY, spellDir]);
      let spellCard = document.getElementById([spellPositionX, spellPositionY]);
      spellCard.className += " spell";
    }
  }

  updateLife() {
    let bossCard = document.getElementById([this.position]);
    if (this.life > 0) {
      bossCard.innerHTML = this.life;
    } else {
      bossCard = "";
    }
  }
}
