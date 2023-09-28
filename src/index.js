const board = document.getElementById("board");

class Game {
  constructor() {
    this.boardSize = [21, 21];
    this.boards = [];
    this.startMob = 2;
    this.waveAcc = 2;
    this.waveDur = 30;
    this.waveNum = 0;
    this.objFreq = 20;
    this.treeFreq = 15;
    this.lifeStart = 10;
    this.strengthStart = 1;
    this.mobs = [];
    this.tree = [];
    this.hero = {};
    this.objects = [];
    this.security = 0;
  }

  /** INIT THE GAME
   */ ////////////////////////

  initialize() {
    this.security += 1;
    if (this.security === 1) {
      //Clean the map
      this.mobs = [];
      this.objects = [];
      this.tree = [];
      this.hero = {};
      this.waveNum = 0;
      const allCard = document.querySelectorAll(".board-card");
      for (let element of allCard) {
        element.remove();
      }
      board.innerHTML = "";
      const timer = document.getElementById("timing-box");
      timer.innerHTML = "";

      // Spawn and start the game
      this.spawnMap();
      this.spawnMob();
      this.spawnTree();
      this.setData();
      this.checkStatus();
      const startPosition = [21, Math.round(this.boardSize[1] / 2)];
      hero.spawn(startPosition, "up");
      this.hero = hero;
      this.run();

      // Release security
      let intervalID4 = setInterval(() => {
        this.security = 0;
        clearInterval(intervalID4);
      }, 3000);
    }
  }

  /** CHECK THE GAME
   */ ////////////////////////

  checkStatus() {
    if (hero.life <= 0) {
      board.innerHTML = "LOST";
      board.innerHTML.style = "text-align:center";
      clearInterval(intervalID3);
    }
  }

  /** GENERATE
   */ ////////////////////////

  setData() {
    // Set Start Life
    const life = document.getElementById("life-box");
    life.innerHTML = "";
    hero.life = this.lifeStart;
    for (let i = 0; i < this.lifeStart; i++) {
      life.innerHTML += "💛";
    }
    // Set Start Strength
    const strength = document.getElementById("strength-box");
    strength.innerHTML = "";
    for (let i = 0; i < this.strengthStart; i++) {
      strength.innerHTML += "🏹";
    }

    // Set Timer
    let time = this.waveDur;
    const timer = document.getElementById("timing-box");
    let intervalID3 = setInterval(() => {
      timer.innerHTML = time + "s";
      time--;
      if (time == 0) {
        clearInterval(intervalID3);
      }
      if (hero.life === 0) {
        clearInterval(intervalID3);
      }
    }, 1000);
  }

  spawnMap() {
    //Generate the board_cards
    for (let i = 1; i <= this.boardSize[0]; i++) {
      for (let j = 1; j <= this.boardSize[1]; j++) {
        this.boards.push({ i, j });
        let divCard = document.createElement("div");
        board.appendChild(divCard);
        divCard.className = "board-card grass";
        divCard.id = [i, j];
        let width = 100 / this.boardSize[1];
        let height = 80 / this.boardSize[0];
        divCard.style.width = `${width}%`;
        divCard.style.height = `${height}vh`;
      }
    }
  }

  spawnMob() {
    // First wave
    let intervalID = setInterval(() => {
      this.waveNum += 1;
      const waveNum = document.getElementById("numb-box");
      waveNum.innerHTML = 1;
      let mobNum = this.startMob + (this.waveNum - 1) * this.waveAcc;
      for (let i = mobNum; i > 0; i--) {
        let mob = new Mob();
        let mobX = 1 + Math.floor(Math.random() * this.boardSize[0]);
        let mobY = 1 + Math.floor(Math.random() * this.boardSize[1]);
        mob.spawn(mobX, mobY, this.waveNum);
        this.mobs.push(mob);
        console.log(this.mobs);
      }
      console.log("end of 1st wave");

      clearInterval(intervalID);
    }, 500);

    // Spawn Mob every wave
    // let intervalID2 = setInterval(() => {
    // this.waveNum += 1;
    // let mobNum = this.startMob + (this.waveNum - 1) * this.waveAcc;
    // for (let i = mobNum; i > 0; i--) {
    //   let mob = new Mob();
    //   let mobX = 1+Math.floor(Math.random() * this.boardSize[0]);
    //   let mobY = 1+Math.floor(Math.random() * this.boardSize[1]);
    //   mob.spawn(mobX, mobY, this.waveNum);
    // this.mobs.push(mob);
    //   //   }
    // }, this.waveDur * 1000);
  }

  spawnTree() {
    for (let i = this.treeFreq; i > 0; i--) {
      let treeX = 1 + Math.floor(Math.random() * this.boardSize[0]);
      let treeY = 1 + Math.floor(Math.random() * this.boardSize[1]);
      let tree = [treeX, treeY];
      this.tree.push(tree);
      console.log(tree);

      //Initializing 1st treeCard
      const treeCard = document.getElementById(tree);
      treeCard.className = "board-card tree";
    }
  }

  /** RUN THE GAME
   */ ////////////////////////

  run() {
    let intervalID3 = setInterval(() => {
      // Make Mobs move
      let heroPosition = hero.position;
      // Loop for each Mob
      for (let element of this.mobs) {
        //Calculate shortest way to the Hero
        let xDiff = Math.abs(heroPosition[0] - element.position[0]);
        let yDiff = Math.abs(heroPosition[1] - element.position[1]);
        let x = 0;
        let y = 0;

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

        // check Hero - don't pass through
        if (
          heroPosition[0] === element.position[0] + x &&
          heroPosition[1] === element.position[1] + y
        ) {
          x = 0;
          y = 0;

          // + Attack Hero !!

          element.attack();
          console.log(element.position + "hero there");
          continue;
        }
        console.log(element.position + "no hero there");
        // check others Mobs - don't pass through
        for (let element2 of this.mobs) {
          // Check Front
          if (
            element2.position[0] === element.position[0] + x &&
            element2.position[1] === element.position[1] + y
          ) {
            console.log(
              element.position +
                " Mob in front, direction (" +
                (element.position[0] + x) +
                "/" +
                (element.position[1] + y) +
                ", checking if mob there :" +
                element2.position[0] +
                "/" +
                element2.position[1]
            );
            // Check One-Side

            for (let element3 of this.mobs) {
              console.log("toto" + x + "/" + y);
              if (
                element3.position[0] === element.position[0] + y &&
                element3.position[1] === element.position[1] + x
              ) {
                console.log(
                  element.position +
                    " Mob in One-Side, direction (" +
                    (element.position[0] + y) +
                    "/" +
                    (element.position[1] + x) +
                    ", checking if mob there :" +
                    element3.position[0] +
                    "/" +
                    element3.position[1]
                );
                // Check Other-Side
                for (let element4 of this.mobs) {
                  if (
                    element4.position[0] === element.position[0] - y &&
                    element4.position[1] === element.position[1] - x
                  ) {
                    console.log(
                      element.position +
                        " Mob in Other-Side, direction (" +
                        (element.position[0] + ":" + -y) +
                        "/" +
                        (element.position[1] + ":" + -x) +
                        ", checking if mob there :" +
                        element4.position[0] +
                        "/" +
                        element4.position[1]
                    );
                    x = 0;
                    y = 0;
                    break;
                  } else {
                    x = -y;
                    y = -x;
                    break;
                  }
                }
              } else {
                console.log(
                  element.position +
                    " No Mob in One-Side, direction (" +
                    (element.position[0] + ":" + y) +
                    "/" +
                    (element.position[1] + ":" + x) +
                    ", checking if mob there :" +
                    element3.position[0] +
                    "/" +
                    element3.position[1]
                );
                console.log("answer : " + x + "/" + y);
                x += y;
                y += x;
                console.log("answer3 : " + x + "/" + y);
                break;
              }
            }
          }
        }
        // Move
        element.move(x, y);
      }

      const btnRight = document.getElementById("start");
      btnRight.addEventListener("click", () => {
        clearInterval(intervalID3);
      });
    }, 1000);
  }
}

//////////////////////////////////////////////////

class Mob {
  constructor() {
    this.position = [];
    this.orientation = "up";
    this.speed = 1;
    this.attackSpeed = 1;
    this.life = 1;
    this.createDate = 0;
    this.wave = 0;
  }

  spawn(x, y, wave) {
    this.position = [x, y];
    this.wave = wave;
    console.log("spawned");

    //Initializing 1st mobCard
    const mobCard = document.getElementById([this.position]);
    mobCard.className = "board-card mob";
  }

  move(x, y) {
    let oldMobCard = document.getElementById([this.position]);

    this.position[0] = this.position[0] + x;
    this.position[1] = this.position[1] + y;

    // Modify mobCard
    oldMobCard.className = "board-card grass";
    let newMobCard = document.getElementById([this.position]);
    newMobCard.className = "board-card mob";
  }

  attack() {
    hero.life--;

    // Set New Life
    const life = document.getElementById("life-box");
    life.innerHTML = "";
    for (let i = 0; i < hero.life; i++) {
      life.innerHTML += "💛";
    }

    // Skin attack
    let mobCard = document.getElementById(this.position);
    mobCard.className += "-attack";
    // Clear Mob skin
    let intervalID4 = setInterval(() => {
      mobCard.className = "board-card mob";
      clearInterval(intervalID4);
    }, 100);
  }
}

//////////////////////////////////////////////////

class Hero {
  constructor() {
    this.position = {};
    this.orientation = "up";
    this.speed = 1;
    this.attackSpeed = 1;
    this.life = 3;
    this.strength = 1;
    this.attackMode = "auto";
  }

  spawn(startPosition) {
    this.position = startPosition;
    const heroCard = document.getElementById([this.position]);
    heroCard.className = "board-card hero hero-up";
  }

  move(x, y, dir) {
    let oldHeroCard = document.getElementById([this.position]);
    oldHeroCard.className = "board-card grass";
    let newX = this.position[0] + x;
    let newY = this.position[1] + y;
    let mobCheck = false;

    for (let element2 of game.mobs) {
      if (element2.position[0] === newX && element2.position[1] === newY) {
        mobCheck = true;
      }
    }

    // check if out of map
    if (
      newX === 0 ||
      newY === 0 ||
      newX > game.boardSize[0] ||
      newY > game.boardSize[1] ||
      mobCheck === true
    ) {
      oldHeroCard.className = `board-card hero hero-${dir}`;
    } else {
      this.position = [newX, newY];
      let newHeroCard = document.getElementById([newX, newY]);
      newHeroCard.className = `board-card hero hero-${dir}`;
    }
  }

  action() {
    //Check direction
    let heroCard = document.getElementById(this.position);
    let oldClass = heroCard.className;
    heroCard.className += "-attack";
    let x = 0;
    let y = 0;

    let dir = heroCard.className.substring(
      heroCard.className.indexOf("hero-") + 5,
      heroCard.className.length
    );
    console.log(dir);
    if (dir === "up-attack") {
      x = -1;
    } else if (dir === "down-attack") {
      x = 1;
    } else if (dir === "right-attack") {
      y = 1;
    } else if (dir === "left-attack") {
      y = -1;
    }

    // Check Mob
    for (let element of game.mobs) {
      if (
        this.position[0] + x === element.position[0] &&
        this.position[1] + y === element.position[1]
      ) {
        // hit
        console.log("hit");
        console.log(element);
        element.life -= this.strength;
        if (element.life <= 0) {
          const mobCard = document.getElementById(element.position);
          mobCard.className = "board-card grass";
          console.log("dead");
          console.log(element.className);
          console.log(game.mobs);
          console.log(game.mobs.length);
          let mobIndex;
          for (let i = 0; i < game.mobs.length; i++) {
            if (
              element.position[0] === game.mobs[i].position[0] &&
              element.position[1] === game.mobs[i].position[1]
            ) {
              mobIndex = i;
              console.log(mobIndex);
              break;
            }
          }
          console.log(mobIndex);
          game.mobs.splice(mobIndex, 1);
          break;
        }
      }
    }

    // Clear Hero skin
    let intervalID4 = setInterval(() => {
      heroCard.className = oldClass;
      clearInterval(intervalID4);
    }, 100);
  }
}

//////////////////////////////////////////////////

class Object {
  constructor(position, type, createDate) {
    this.position = position;
    this.type = type;
    this.createDate = createDate;
    this.timing = 30;
  }
  spawn() {}
  disappear() {}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let game = new Game();
let hero = new Hero();

// Start/Stop Button
const btnRight = document.getElementById("start");
btnRight.addEventListener("click", () => {
  game.initialize();
});

// Move Hero KeyPad
window.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.code === "KeyQ") {
      // Attack"
      hero.action();
    }
    if (event.code === "ArrowDown") {
      // Handle "down"
      hero.move(1, 0, "down");
      console.log("down");
    } else if (event.code === "ArrowUp") {
      // Handle "up"
      hero.move(-1, 0, "up");
      console.log("up");
    } else if (event.code === "ArrowLeft") {
      // Handle "left"
      hero.move(0, -1, "left");
      console.log("left");
    } else if (event.code === "ArrowRight") {
      // Handle "right"
      hero.move(0, 1, "right");
      console.log("right");
    }
  },
  true
);

// Move Hero Picture

const key2 = document.getElementById("keyPad2");
key2.addEventListener("click", () => {
  hero.move(-1, 0, "up");
});
const key4 = document.getElementById("keyPad4");
key4.addEventListener("click", () => {
  hero.move(0, -1, "left");
});
const key6 = document.getElementById("keyPad6");
key6.addEventListener("click", () => {
  hero.move(0, 1, "right");
  console.log("right");
});
const key8 = document.getElementById("keyPad8");
key8.addEventListener("click", () => {
  hero.move(1, 0, "down");
});
