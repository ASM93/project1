class Mob {
  constructor() {
    this.position = [];
    this.previousPosition = [];
    this.possibleWays = [];
    this.bestWay = [];
    this.orientation = "up";
    this.speed = 1;
    this.attackSpeed = 1;
    this.life = 3;
    this.createDate = 0;
    this.wave = 0;
  }

  spawn(x, y, wave) {
    this.position = [x, y];
    this.wave = wave;

    //Initializing 1st mobCard
    const mobCard = document.getElementById([this.position]);
    mobCard.className += " mob";
    mobCard.innerHTML = this.life;
  }

  calcBestWay(element) {
    let heroPosition = hero.position;

    //Calculate shortest way to the Hero
    let xDiff = Math.abs(heroPosition[0] - element.position[0]);
    let yDiff = Math.abs(heroPosition[1] - element.position[1]);
    let x = 0;
    let y = 0;
    let random = Math.random();

    // Randomly choose way

    if (random >= 0.5) {
      if (xDiff >= yDiff && heroPosition[0] > element.position[0]) {
        x = 1;
        y = 0;
      } else if (xDiff >= yDiff && heroPosition[0] < element.position[0]) {
        x = -1;
        y = 0;
      } else if (xDiff < yDiff && heroPosition[1] > element.position[1]) {
        x = 0;
        y = 1;
      } else if (xDiff < yDiff && heroPosition[1] < element.position[1]) {
        x = 0;
        y = -1;
      }
    } else {
      if (xDiff < yDiff && heroPosition[1] > element.position[1]) {
        x = 0;
        y = 1;
      } else if (xDiff < yDiff && heroPosition[1] < element.position[1]) {
        x = 0;
        y = -1;
      } else if (xDiff >= yDiff && heroPosition[0] > element.position[0]) {
        x = 1;
        y = 0;
      } else if (xDiff >= yDiff && heroPosition[0] < element.position[0]) {
        x = -1;
        y = 0;
      }
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
      for (let i = 0; i < game.mobs.length; i++) {
        obstacle.push(game.mobs[i].position);
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
    let oldMobCard = document.getElementById([this.position]);
    oldMobCard.innerHTML = "";
    this.previousPosition = [];
    this.previousPosition = [this.position[0], this.position[1]];

    this.position[0] = this.position[0] + x;
    this.position[1] = this.position[1] + y;

    // Modify mobCard
    let newOldCard = oldMobCard.className.replace("mob", "");
    oldMobCard.className = newOldCard;
    let newMobCard = document.getElementById([this.position]);
    newMobCard.className += " mob";
    this.updateLife();
  }

  attack() {
    // Set less Life
    hero.life--;
    hero.updateData();

    // Skin attack

    let mobCard = document.getElementById([this.position]);
    let newOldCard = mobCard.className.replace("mob", "mob-attack");
    newOldCard += " mob-attack";
    mobCard.className = newOldCard;

    // Clear Mob skin
    setTimeout(() => {
      let newOldCard2 = mobCard.className
        .replaceAll("mob-attack", "mob")
        .replaceAll(" ", "")
        .replaceAll("-attack", "")
        .replaceAll("mob", "");
      newOldCard2 += " mob";
      mobCard.className = newOldCard2;
    }, 150);
  }

  updateLife() {
    let mobCard = document.getElementById([this.position]);
    if (this.life > 0) {
      mobCard.innerHTML = this.life;
    } else {
      mobCard = "";
    }
  }
}
