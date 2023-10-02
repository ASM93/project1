const board = document.getElementById("board");

class Game {
  constructor() {
    this.boardSize = [21, 21];
    this.boards = [];
    this.boardNum = 0;
    this.boardType = 0;
    this.castle = [];
    this.startMob = 1;
    this.waveAcc = 2;
    this.waveDur = 100;
    this.waveNum = 0;
    this.objFreq = 20;
    this.treeFreq = 45;
    this.lifeStart = 3;
    this.strengthStart = 1;
    this.mobs = [];
    this.tree = [];
    this.hero = {};
    this.gates = [];
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
      this.gates = [];
      this.hero = {};
      this.waveNum = 0;
      this.boardType = 0;
      const allCard = document.querySelectorAll(".board-card");
      for (let element of allCard) {
        element.remove();
      }
      board.innerHTML = "";
      const timer = document.getElementById("timing-box");
      timer.innerHTML = "";

      // Spawn and start the game
      this.spawnMob();
      this.spawnMap(this.boardType);
      this.spawnTree();
      this.spawnGates();
      this.setData();
      this.boardNum++;

      const startPosition = [
        Math.round(this.boardSize[0]),
        Math.round(this.boardSize[1] / 2),
      ];
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

  newBoard(oldGate, type) {
    //Clean the map
    this.mobs = [];
    this.objects = [];
    this.tree = [];
    this.gates = [];
    this.castle = [];
    const allCard = document.querySelectorAll(".board-card");
    for (let element of allCard) {
      element.remove();
    }
    board.innerHTML = "";

    // Spawn and start the game
    this.spawnMap(this.boardType);
    this.spawnMob();
    this.spawnTree(type);

    this.boardNum++;

    let startDir = "";
    let startPosition = [];

    // Calculate Hero position
    if (oldGate[1] === 1) {
      startDir = "left";
      startPosition = [Math.round(this.boardSize[0] / 2), this.boardSize[0]];
    } else if (oldGate[1] === this.boardSize[1]) {
      startDir = "right";
      startPosition = [Math.round(this.boardSize[0] / 2), 1];
    } else if (oldGate[0] === this.boardSize[0]) {
      startDir = "down";
      startPosition = [1, Math.round(this.boardSize[1] / 2)];
    } else {
      startDir = "up";
      startPosition = [this.boardSize[0], Math.round(this.boardSize[1] / 2)];
    }

    hero.spawn(startPosition, startDir);
    this.spawnGates(startPosition);
  }

  /** CHECK THE GAME
   */ ////////////////////////

  checkStatus() {
    if (hero.life <= 0) {
      board.innerHTML = "LOST";
      board.innerHTML.style = "text-align:center";
      clearInterval(intervalID3);
      return "Dead";
    }
    return "Alive";
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

  spawnMap(type) {
    genMap(type, this.boardSize);
  }

  spawnMob() {
    // First wave
    let intervalID = setInterval(() => {
      this.waveNum += 1;
      const waveNum = document.getElementById("numb-box");
      waveNum.innerHTML = 1;
      let mobNum = this.startMob + (this.waveNum - 1) * this.waveAcc;
      let check = false;
      for (let i = mobNum; i > 0; i--) {
        let mob = new Mob();
        let mobX = 1 + Math.floor(Math.random() * this.boardSize[0]);
        let mobY = 1 + Math.floor(Math.random() * this.boardSize[1]);

        // Check obstacle
        let check = false;
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

        for (let element of obstacle) {
          if (mobX === element[0] && mobY === element[1]) {
            check = true;
          }
        }
        if (check === false) {
          mob.spawn(mobX, mobY, this.waveNum);
          this.mobs.push(mob);
        } else {
          i++;
        }
      }

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

  spawnTree(type) {
    for (let i = this.treeFreq; i > 0; i--) {
      let treeX = 1 + Math.floor(Math.random() * this.boardSize[0]);
      let treeY = 1 + Math.floor(Math.random() * this.boardSize[1]);
      let tree = [treeX, treeY];
      let check = false;

      for (let element of game.castle) {
        if (tree[0] === element[0] && tree[1] === element[1]) {
          check = true;
        }
      }

      if (check === false) {
        this.tree.push(tree);
        //Initializing 1st treeCard
        const treeCard = document.getElementById(tree);

        if (type === 2) {
          treeCard.className = "board-card castle";
        } else {
          treeCard.className = "board-card tree";
        }
      } else {
        i++;
      }
    }
  }

  spawnGates(oldGate) {
    let possibleGates = [];
    let random = 0;

    if (oldGate) {
      let random = Math.floor(Math.random() * 3);
      possibleGates.push(
        [1, Math.round(this.boardSize[0] / 2)], //top
        [Math.round(this.boardSize[0]), Math.round(this.boardSize[1] / 2)], //down
        [Math.round(this.boardSize[0] / 2), 1],
        [Math.round(this.boardSize[0] / 2), 21] //left
      );

      let check = "";
      for (let i = 0; i < possibleGates.length; i++) {
        if (
          possibleGates[i][0] === oldGate[0] &&
          possibleGates[i][1] === oldGate[1]
        ) {
          check = i;
        }
      }

      possibleGates.splice(check, 1);

      this.gates.push(possibleGates[random]);
    } else {
      let random = Math.floor(Math.random() * 3);

      possibleGates.push(
        [1, Math.round(this.boardSize[0] / 2)], //top
        [Math.round(this.boardSize[0] / 2), 1],
        [Math.round(this.boardSize[0] / 2), this.boardSize[1]] //left
      );
      this.gates.push(possibleGates[random]);
    }
    for (let element of this.gates) {
      const gateCard = document.getElementById(element);
      gateCard.className = "board-card gate";
    }
  }

  /** RUN THE GAME
   */ ////////////////////////

  run() {
    let intervalID3 = setInterval(() => {
      //let status = this.checkStatus();
      // Make Mobs move
      for (let element of this.mobs) {
        let bestWay = element.calcBestWay(element);
        element.move(bestWay[0], bestWay[1]);
      }

      // Stop Game
      if (status === "Dead") {
        clearInterval(intervalID3);
      }
      const btnRight = document.getElementById("start");
      btnRight.addEventListener("click", () => {
        clearInterval(intervalID3);
      });
    }, 1000);
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
  game.boardNum = 0;
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
    } else if (event.code === "ArrowUp") {
      // Handle "up"
      hero.move(-1, 0, "up");
    } else if (event.code === "ArrowLeft") {
      // Handle "left"
      hero.move(0, -1, "left");
    } else if (event.code === "ArrowRight") {
      // Handle "right"
      hero.move(0, 1, "right");
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
});
const key8 = document.getElementById("keyPad8");
key8.addEventListener("click", () => {
  hero.move(1, 0, "down");
});
