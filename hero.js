class Hero {
  constructor() {
    this.position = {};
    this.spells = [];
    this.orientation = "up";
    this.speed = 1;
    this.attackSpeed = 1;
    this.life = 3;
    this.strength_phy = 2;
    this.strength_spell = 1;
    this.attackMode = "auto";
    this.canMove = true;
  }

  spawn(startPosition, dir) {
    this.position = startPosition;
    const heroCard = document.getElementById([this.position]);
    heroCard.className = `hero hero-${dir}`;
  }

  move(x, y, dir) {
    if (!this.canMove) return;
    let oldHeroCard = document.getElementById([this.position]);
    let newOldHeroCard = oldHeroCard.className.replace(/hero(.*)/, "");
    oldHeroCard.className = newOldHeroCard;
    let newX = this.position[0] + x;
    let newY = this.position[1] + y;
    let mobCheck = false;
    let bossCheck = false;
    let objectCheck = false;
    let object;
    let objIndex = -1;
    let treeCheck = false;
    let gateCheck = false;
    let castleCheck = false;

    // check if mobs, boss, tree, castle, object, gate
    for (let element of game.mobs) {
      if (element.position[0] === newX && element.position[1] === newY) {
        mobCheck = true;
        break;
      }
    }
    for (let element of game.boss) {
      if (element.position[0] === newX && element.position[1] === newY) {
        bossCheck = true;
        break;
      }
    }
    for (let element of game.tree) {
      if (element[0] === newX && element[1] === newY) {
        treeCheck = true;
        break;
      }
    }
    for (let element of game.castle) {
      if (element[0] === newX && element[1] === newY) {
        castleCheck = true;
        break;
      }
    }
    for (let element of game.gates) {
      if (element[0] === newX && element[1] === newY) {
        gateCheck = true;
        break;
      }
    }
    for (let i = 0; i < game.objects.length; i++) {
      if (
        game.objects[i].position[0] === newX &&
        game.objects[i].position[1] === newY
      ) {
        objectCheck = true;
        object = game.objects[i];
        objIndex = i;
        break;
      }
    }

    //// MOVINGGGG ////
    // IF GATE

    if (gateCheck === true) {
      if (game.waveNum === 4) {
        game.boardType = 3;
      } else if (game.boardType === 1) {
        game.boardType = 2;
      } else if (game.waveNum === 1) {
        game.boardType = 1;
      }
      game.newBoard([newX, newY]);
    }
    // IF OBJECT
    else if (objectCheck === true) {
      this.position = [newX, newY];
      let newHeroCard = document.getElementById([newX, newY]);
      let newHeroCard2 = newHeroCard.className.replace(/obj-(.*)/, "");
      newHeroCard2 += ` hero hero-${dir}`;
      newHeroCard.className = newHeroCard2;
      game.objects.splice(objIndex, 1);

      //effect
      if (object.type === "health" && this.life <= 3) {
        this.life++;
        this.updateData();
      } else if (object.type === "strength" && this.strength_phy <= 2) {
        this.strength_phy++;
        this.updateData();
      } else if (object.type === "spell" && this.strength_spell <= 2) {
        this.strength_spell++;
        this.updateData();
      }
    }
    // IF OUTSIDE, MOB, TREE, CASTLE
    else if (
      newX === 0 ||
      newY === 0 ||
      newX > game.boardSize[0] ||
      newY > game.boardSize[1] ||
      mobCheck === true ||
      bossCheck === true ||
      treeCheck === true ||
      castleCheck === true
    ) {
      oldHeroCard.className += ` hero hero-${dir}`;
    }
    // MOVE !
    else {
      this.position = [newX, newY];
      let newHeroCard = document.getElementById([newX, newY]);
      newHeroCard.className += ` hero hero-${dir}`;
    }
  }

  attack() {
    //Check direction
    this.canMove = false;
    let heroCard = document.getElementById(this.position);
    let oldClass = heroCard.className;
    heroCard.className += "-attack";

    // Clear Hero skin
    setTimeout(() => {
      heroCard.className = oldClass;
      this.canMove = true;
    }, 100);

    let x = 0;
    let y = 0;

    let dir = heroCard.className.substring(
      heroCard.className.indexOf("hero-") + 5,
      heroCard.className.length
    );
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

    let allMobs = [...game.mobs];

    if (game.boardType === 3) {
      allMobs.push(game.boss[0]);
    }

    for (let element of allMobs) {
      if (
        this.position[0] + x === element.position[0] &&
        this.position[1] + y === element.position[1]
      ) {
        // hit
        element.life -= this.strength_phy;
        element.updateLife();
        if (element.life <= 0) {
          const mobCard = document.getElementById(element.position);
          let newMobCard = mobCard.className.replace("mob", "");
          mobCard.innerHTML = "";
          mobCard.className = newMobCard;
          let mobIndex;
          for (let i = 0; i < game.mobs.length; i++) {
            if (
              element.position[0] === game.mobs[i].position[0] &&
              element.position[1] === game.mobs[i].position[1]
            ) {
              mobIndex = i;
              break;
            }
          }
          game.mobs.splice(mobIndex, 1);
          break;
        }
      }
    }
  }
  spell() {
    //Init Hero
    let heroCard = document.getElementById(this.position);
    let oldClass = heroCard.className;
    heroCard.className += "-spell";

    // Clear Hero skin
    setTimeout(() => {
      heroCard.className = oldClass;
    }, 100);

    let x = 0;
    let y = 0;

    if (hero.spells.length !== 0) {
      return;
    }

    let dir = heroCard.className.substring(
      heroCard.className.indexOf("hero-") + 5,
      heroCard.className.length
    );
    if (dir === "up-spell") {
      x = -1;
    } else if (dir === "down-spell") {
      x = 1;
    } else if (dir === "right-spell") {
      y = 1;
    } else if (dir === "left-spell") {
      y = -1;
    }

    // Init obstacle
    let obstacle = [...game.tree];
    for (let i = 0; i < game.gates.length; i++) {
      obstacle.push(game.gates[i]);
    }
    for (let i = 0; i < game.castle.length; i++) {
      obstacle.push(game.castle[i]);
    }

    // Create Spell
    let spellPositionX = hero.position[0] + x;
    let spellPositionY = hero.position[1] + y;
    let spellDir = dir.substring(0, dir.indexOf("-"));

    let obstacleCheck = false;
    for (let element of obstacle) {
      if (element[0] === spellPositionX && element[1] === spellPositionY) {
        obstacleCheck = true;
      }
    }

    if (obstacleCheck === false) {
      hero.spells.push([spellPositionX, spellPositionY, spellDir]);
      let spellCard = document.getElementById([spellPositionX, spellPositionY]);
      spellCard.className += " spell";
    }
  }

  updateData() {
    const life = document.getElementById("life-box");
    life.innerHTML = "";
    for (let i = 0; i < hero.life; i++) {
      life.innerHTML += "💛";
    }
    const strength_phy = document.getElementById("strength-box_phy");

    strength_phy.innerHTML = "";
    for (let i = 0; i < this.strength_phy; i++) {
      strength_phy.innerHTML += "🏹";
    }
    const strength_spell = document.getElementById("strength-box_spell");
    strength_spell.innerHTML = "";
    for (let i = 0; i < this.strength_spell; i++) {
      strength_spell.innerHTML += "✨";
    }
  }
}
