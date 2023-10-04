const board = document.getElementById("board");

class Game {
  constructor() {
    this.boardSize = [21, 21];
    this.boards = [];
    this.boardNum = 0;
    this.boardType = 1;
    this.castle = [];
    this.startMob = 1;
    this.waveAcc = 2;
    this.waveDur = 100;
    this.waveNum = 0;
    this.objFreq = 30;
    this.spellSpeed = 4;
    this.treeFreq = 45;
    this.lifeStart = 3;
    this.strengthStart = 1;
    this.mobs = [];
    this.boss = [];
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
      this.boss = [];
      this.objects = [];
      this.tree = [];
      this.gates = [];
      this.castle = [];
      this.hero = {};
      hero.spells = [];
      hero.life = this.lifeStart;
      this.waveNum = 0;
      this.boardType = 0;
      const allCard = document.querySelectorAll(".board-card");
      for (let element of allCard) {
        element.remove();
      }
      board.innerHTML = "";
      const timer = document.getElementById("timing-box");
      timer.innerHTML = "";
      let boardCard = document.getElementById("board");
      boardCard.className = "board";

      // Spawn and start the game
      this.spawnMap(this.boardType, this.boardSize, [
        this.boardSize[0],
        Math.round(this.boardSize[1] / 2),
      ]);
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

  newBoard(oldGate) {
    //Clean the map
    this.mobs = [];
    this.boss = [];
    this.objects = [];
    this.tree = [];
    this.gates = [];
    this.castle = [];
    hero.spells = [];
    this.boardNum++;
    let startDir = "";
    let startPosition = [];
    const allCard = document.querySelectorAll(".board-card");
    for (let element of allCard) {
      element.remove();
    }
    board.innerHTML = "";

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
    this.spawnMap(this.boardType, this.boardSize, startPosition);
    hero.spawn(startPosition, startDir);
  }

  /** CHECK THE GAME
   */ ////////////////////////

  checkStatus() {
    if (this.boardType === 3 && this.boss) {
      if (game.boss[0].life <= 0) {
        board.innerHTML = "WIN";
        return "Dead";
      }
    }
    if (hero.life <= 0) {
      board.innerHTML = "LOST";
      return "Dead";
    } else {
      return "Alive";
    }
  }
  /** GENERATE
   */ ////////////////////////

  setData() {
    hero.updateData();

    // // Set Start Life
    // const life = document.getElementById("life-box");
    // life.innerHTML = "";
    // hero.life = this.lifeStart;
    // for (let i = 0; i < this.lifeStart; i++) {
    //   life.innerHTML += "💛";
    // }
    // // Set Start Strength
    // const strength = document.getElementById("strength-box");
    // strength.innerHTML = "";
    // for (let i = 0; i < this.strengthStart; i++) {
    //   strength.innerHTML += "🏹";
    // }

    // // Set Timer
    // let time = this.waveDur;
    // const timer = document.getElementById("timing-box");
    // let intervalID3 = setInterval(() => {
    //   timer.innerHTML = time + "s";
    //   time--;
    //   if (time == 0) {
    //     clearInterval(intervalID3);
    //   }
    //   if (hero.life === 0) {
    //     clearInterval(intervalID3);
    //   }
    // }, 1000);
  }

  spawnMap(type, startPosition) {
    genMap(type, game.boardSize, startPosition);
  }

  spawnMob() {
    // First wave
    setTimeout(() => {
      this.waveNum += 1;

      let mobNum = this.startMob + (this.waveNum - 1) * this.waveAcc;
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

  spawnBoss() {
    setTimeout(() => {
      this.waveNum += 1;

      let boss = new Boss();
      let bossX = Math.floor(this.boardSize[0] / 2);
      let bossY = Math.floor(this.boardSize[1] / 2);

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
        if (bossX === element[0] && bossY === element[1]) {
          check = true;
        }
      }
      if (check === false) {
        boss.spawn(bossX, bossY, this.waveNum);
        game.boss.push(boss);
      } else {
        i++;
      }
    }, 500);
  }

  spawnTree(noCard) {
    for (let i = this.treeFreq; i > 0; i--) {
      let treeX = 1 + Math.floor(Math.random() * this.boardSize[0]);
      let treeY = 1 + Math.floor(Math.random() * this.boardSize[1]);
      let tree = [treeX, treeY];
      let check = false;

      for (let element of noCard) {
        if (tree[0] === element[0] && tree[1] === element[1]) {
          check = true;
        }
      }

      if (check === false) {
        this.tree.push(tree);
        //Initializing 1st treeCard
        const treeCard = document.getElementById(tree);
        treeCard.className = "board-card tree";
      } else {
        i++;
      }
    }
  }

  spawnWalls() {
    // Wall : LEFT
    for (let i = 1; i <= this.boardSize[0]; i++) {
      let check = false;
      let index = i;
      for (let element of game.gates) {
        if (index === element[0] && 1 === element[1]) {
          check = true;
          break;
        }
      }
      if (check === false) {
        const treeCard = document.getElementById([index, 1]);
        treeCard.className = "board-card tree";
        game.tree.push([index, 1]);
      }
    }

    // Wall : RIGHT
    for (let i = 1; i <= this.boardSize[0]; i++) {
      let check = false;
      let index = i;
      for (let element of game.gates) {
        if (index === element[0] && this.boardSize[0] === element[1]) {
          check = true;
          break;
        }
      }
      if (check === false) {
        const treeCard = document.getElementById([index, this.boardSize[0]]);
        treeCard.className = "board-card tree";
        game.tree.push([index, this.boardSize[0]]);
      }
    }

    // Wall : TOP
    for (let i = 1; i <= this.boardSize[0]; i++) {
      let check = false;
      let index = i;
      for (let element of game.gates) {
        if (1 === element[0] && index === element[1]) {
          check = true;
          break;
        }
      }
      if (check === false) {
        const treeCard = document.getElementById([1, index]);
        treeCard.className = "board-card tree";
        game.tree.push([1, index]);
      }
    }

    // Wall : DOWN
    for (let i = 1; i <= this.boardSize[0]; i++) {
      let check = false;
      let index = i;
      for (let element of game.gates) {
        if (this.boardSize[0] === element[0] && index === element[1]) {
          check = true;
          break;
        }
      }
      if (check === false) {
        const treeCard = document.getElementById([this.boardSize[0], index]);
        treeCard.className = "board-card tree";
        game.tree.push([this.boardSize[0], index]);
      }
    }
  }

  spawnGates(oldGate) {
    let possibleGates = [];

    if (game.boardType === 0 || game.boardType === 2) {
      let random = Math.floor(Math.random() * 3);
      possibleGates.push(
        [1, Math.round(game.boardSize[0] / 2)], //top
        [Math.round(game.boardSize[0] / 2), 1],
        [Math.round(game.boardSize[0] / 2), game.boardSize[1]] //left
      );
      game.gates.push(possibleGates[random]);
    }
    // no other gate than the Castle's one
    else if (game.boardType === 1) {
      // prout
    }
    // the rest
    else {
      let random = Math.floor(Math.random() * 3);
      possibleGates.push(
        [1, Math.round(game.boardSize[0] / 2)], //top
        [Math.round(game.boardSize[0]), Math.round(game.boardSize[1] / 2)], //down
        [Math.round(game.boardSize[0] / 2), 1],
        [Math.round(game.boardSize[0] / 2), 21] //left
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
      game.gates.push(possibleGates[random]);
    }
    // Change design
    for (let element of game.gates) {
      const gateCard = document.getElementById(element);
      gateCard.className += " gate";
    }
  }

  /** RUN THE GAME
   */ ////////////////////////

  run() {
    let count = 0;
    let intervalID = setInterval(
      () => {
        let check = this.checkStatus();
        if (check === "Dead") {
          clearInterval(intervalID);
        }
        count++;

        /////////// Automate Game, Mobs & Boss - Start ///////////
        if (count % this.spellSpeed === 0) {
          // Make Mobs move
          for (let element of this.mobs) {
            let bestWay = element.calcBestWay(element);
            element.move(bestWay[0], bestWay[1]);
          }

          // Make Boss move
          for (let element of this.boss) {
            let bestWay = element.calcBestWay(element);
            element.move(bestWay[0], bestWay[1]);
          }

          // Stop Game
          if (hero.status === "Dead") {
            clearInterval(intervalID);
          }
          const btnRight = document.getElementById("start");
          btnRight.addEventListener("click", () => {
            clearInterval(intervalID);
          });
        }

        if (count % 10 === 0) {
          // Make Boss spell
          for (let element of this.boss) {
            element.spell();
          }
        }

        /////////// Automate Object - Start ///////////
        if (count % this.objFreq === 0 && game.objects.length <= 3) {
          let object = new Object();
          game.objects.push(object);
          object.spawn();
        }

        /////////// Automate Spell - Start ///////////

        // Init obstacle
        let obstacle = [...game.tree];
        for (let i = 0; i < game.gates.length; i++) {
          obstacle.push(game.gates[i]);
        }
        for (let i = 0; i < game.castle.length; i++) {
          obstacle.push(game.castle[i]);
        }

        /// HERO SPELLS ///
        let spellIndex = -1;
        for (let element of hero.spells) {
          spellIndex++;

          let spellCard = document.getElementById([element[0], element[1]]);

          let x = 0;
          let y = 0;
          if (element[2] === "up") {
            x = -1;
          } else if (element[2] === "down") {
            x = 1;
          } else if (element[2] === "right") {
            y = 1;
          } else if (element[2] === "left") {
            y = -1;
          }

          // Check obstacle, Mobs, OutOfMap, Hero - PART 1
          let checkObstacle = false;
          let checkMob = false;
          let hitMob;
          let hitBoss;
          let checkMap = false;
          let checkHero = false;
          let checkBoss = false;

          for (let element2 of obstacle) {
            if (
              element[0] + x === element2[0] &&
              element[1] + y === element2[1]
            ) {
              checkObstacle = true;
            }
          }
          for (let element3 of this.mobs) {
            if (
              (element[0] + x === element3.position[0] &&
                element[1] + y === element3.position[1]) ||
              (element[0] === element3.position[0] &&
                element[1] === element3.position[1])
            ) {
              checkMob = true;
              hitMob = element3;
            }
          }

          for (let element4 of this.boss) {
            if (
              (element[0] + x === element4.position[0] &&
                element[1] + y === element4.position[1]) ||
              (element[0] === element4.position[0] &&
                element[1] === element4.position[1])
            ) {
              checkBoss = true;
              hitBoss = element4;
            }
          }

          if (
            element[0] + x === this.hero.position[0] &&
            element[1] + y === this.hero.position[1]
          ) {
            checkHero = true;
          }

          if (
            element[0] + x === 0 ||
            element[1] + y === 0 ||
            element[0] + x > game.boardSize[0] ||
            element[1] + y > game.boardSize[1]
          ) {
            checkMap = true;
          }

          // Check obstacle or Map - PART 2
          if (checkObstacle === true || checkMap === true) {
            hero.spells.splice(spellIndex, 1);
            let newSpellCard = spellCard.className.replace("spell", "");
            spellCard.className = newSpellCard;
            continue;
          }
          // Check hero
          else if (checkHero === true) {
            hero.life--;
            hero.updateData();

            // hit - delete spell
            hero.spells.splice(spellIndex, 1);
            let newSpellCard = spellCard.className.replace("spell", "");
            spellCard.className = newSpellCard;
            continue;
          }

          // Check Mobs
          else if (checkMob === true) {
            // hit - damage
            hitMob.life -= hero.strength_spell;
            hitMob.updateLife();
            if (hitMob.life <= 0) {
              const mobCard = document.getElementById(hitMob.position);
              let newMobCard = mobCard.className.replace("mob", "");
              mobCard.className = newMobCard;
              mobCard.innerHTML = "";
              let mobIndex;
              for (let i = 0; i < game.mobs.length; i++) {
                if (
                  hitMob.position[0] === game.mobs[i].position[0] &&
                  hitMob.position[1] === game.mobs[i].position[1]
                ) {
                  mobIndex = i;
                  break;
                }
              }
              game.mobs.splice(mobIndex, 1);
            }
            // hit - delete spell
            let newSpellCard = spellCard.className.replace("spell", "");
            spellCard.className = newSpellCard;
            hero.spells.splice(spellIndex, 1);
            continue;
          }

          // Check Boss
          else if (checkBoss === true) {
            // hit - damage
            hitBoss.life -= hero.strength_spell;
            hitBoss.updateLife();
            if (hitBoss.life <= 0) {
              const mobCard = document.getElementById(hitBoss.position);
              let newMobCard = mobCard.className.replace("boss", "");
              mobCard.className = newMobCard;
              mobCard.innerHTML = "";
              let mobIndex;
              for (let i = 0; i < this.boss.length; i++) {
                if (
                  hitBoss.position[0] === this.boss[i].position[0] &&
                  hitBoss.position[1] === this.boss[i].position[1]
                ) {
                  mobIndex = i;
                  break;
                }
              }
              this.boss.splice(mobIndex, 1);
            }
            // hit - delete spell
            let newSpellCard = spellCard.className.replace("spell", "");
            spellCard.className = newSpellCard;
            hero.spells.splice(spellIndex, 1);
            continue;
          }
          // Move on
          else {
            element[0] = element[0] + x;
            element[1] = element[1] + y;
            let newSpellCard = spellCard.className.replace("spell", ""); //take out previous card
            spellCard.className = newSpellCard;

            let nextSpellCard = document.getElementById([
              element[0],
              element[1],
            ]); // init next card
            nextSpellCard.className += " spell";
          }
        }

        /// BOSS SPELLS ///

        if (this.boardType === 3) {
          // Check all Spells
          let spellIndex2 = -1;

          for (let element of this.boss[0].spells) {
            spellIndex2++;
            let spellCard = document.getElementById([element[0], element[1]]);
            let x = 0;
            let y = 0;
            if (element[2] === "up") {
              x = -1;
            } else if (element[2] === "down") {
              x = 1;
            } else if (element[2] === "right") {
              y = 1;
            } else if (element[2] === "left") {
              y = -1;
            }

            // Check obstacle, Mobs, OutOfMap, Hero - PART 1
            let checkObstacle = false;
            let checkMob = false;
            let hitMob;
            let checkMap = false;
            let checkHero = false;

            for (let element2 of obstacle) {
              if (
                element[0] + x === element2[0] &&
                element[1] + y === element2[1]
              ) {
                checkObstacle = true;
              }
            }
            for (let element3 of this.mobs) {
              if (
                (element[0] + x === element3.position[0] &&
                  element[1] + y === element3.position[1]) ||
                (element[0] === element3.position[0] &&
                  element[1] === element3.position[1])
              ) {
                checkMob = true;
                hitMob = element3;
              }
            }
            if (
              element[0] + x === this.hero.position[0] &&
              element[1] + y === this.hero.position[1]
            ) {
              checkHero = true;
            }
            if (
              element[0] + x === 0 ||
              element[1] + y === 0 ||
              element[0] + x > game.boardSize[0] ||
              element[1] + y > game.boardSize[1]
            ) {
              checkMap = true;
            }

            // Check obstacle or Mobs - PART 2
            if (checkObstacle === true || checkMap === true) {
              this.boss[0].spells.splice(spellIndex2, 1);
              let newSpellCard = spellCard.className.replace("spell", "");
              spellCard.className = newSpellCard;
              continue;
            }
            // Check hero
            else if (checkHero === true) {
              hero.life--;
              hero.updateData();

              // hit - delete spell
              let newSpellCard = spellCard.className.replace("spell", "");
              spellCard.className = newSpellCard;
              this.boss[0].spells.splice(spellIndex2, 1);
              continue;
            }

            // Check Mobs
            else if (checkMob === true) {
              // hit - damage
              hitMob.life -= hero.strength_spell;
              hitMob.updateLife();
              if (hitMob.life <= 0) {
                const mobCard = document.getElementById(hitMob.position);
                let newMobCard = mobCard.className.replace("mob", "");
                mobCard.className = newMobCard;
                mobCard.innerHTML = "";
                let mobIndex;
                for (let i = 0; i < game.mobs.length; i++) {
                  if (
                    hitMob.position[0] === game.mobs[i].position[0] &&
                    hitMob.position[1] === game.mobs[i].position[1]
                  ) {
                    mobIndex = i;
                    break;
                  }
                }
                game.mobs.splice(mobIndex, 1);
              }

              // hit - delete spell
              let newSpellCard = spellCard.className.replace("spell", "");
              spellCard.className = newSpellCard;
              this.boss[0].spells.splice(spellIndex2, 1);
              continue;
            } else {
              // Move on
              element[0] = element[0] + x;
              element[1] = element[1] + y;
              let newSpellCard = spellCard.className.replace("spell", ""); //take out previous card
              spellCard.className = newSpellCard;

              let nextSpellCard = document.getElementById([
                element[0],
                element[1],
              ]); // init next card
              nextSpellCard.className += " spell";
            }
          }
        }
      },

      1000 / this.spellSpeed
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Object {
  constructor() {
    this.position = [];
    this.type = "";
  }
  spawn() {
    // Select type
    let random = Math.floor(Math.random() * 3);
    if (random === 0) {
      this.type = "health";
    } else if (random === 1) {
      this.type = "strength";
    } else if (random === 2) {
      this.type = "spell";
    }

    // Select random position

    let objectX = 1 + Math.floor(Math.random() * game.boardSize[0]);
    let objectY = 1 + Math.floor(Math.random() * game.boardSize[1]);
    this.position = [objectX, objectY];

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

    let check = false;
    for (let element of obstacle) {
      if (this.position[0] === element[0] && this.position[1] === element[1]) {
        check = true;
      }
    }

    if (check === false) {
      //Initializing objectCard
      const objectCard = document.getElementById(this.position);
      if (this.type === "health") {
        objectCard.className += " obj-health";
      } else if (this.type === "strength") {
        objectCard.className += " obj-strength";
      } else if (this.type === "spell") {
        objectCard.className += " obj-spell";
      }
    }
  }
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
      hero.attack();
    }
    if (event.code === "KeyW") {
      // Spell"
      hero.spell();
    }
    if (event.code === "Space") {
      // Reboot"
      game.boardNum = 0;
      game.initialize();
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

const btn_mob_left = document.getElementById("btn_mob_left");
btn_mob_left.addEventListener("click", () => {
  hero.attack();
});

const btn_mob_right = document.getElementById("btn_mob_right");
btn_mob_right.addEventListener("click", () => {
  hero.spell();
});

// IMPORT CLASS

// import Mob from "./mobs.js";
// import Hero from "./hero.js";
// import genMap from "./maps.js";
