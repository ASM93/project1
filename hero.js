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

  spawn(startPosition, dir) {
    this.position = startPosition;
    const heroCard = document.getElementById([this.position]);
    heroCard.className = `board-card hero hero-${dir}`;
  }

  move(x, y, dir) {
    let oldHeroCard = document.getElementById([this.position]);
    let newOldHeroCard = oldHeroCard.className.replace(/hero(.*)/, "");
    oldHeroCard.className = newOldHeroCard;
    let newX = this.position[0] + x;
    let newY = this.position[1] + y;
    let mobCheck = false;
    let treeCheck = false;
    let gateCheck = false;
    let castleCheck = false;

    // check if mobs or tree
    for (let element of game.mobs) {
      if (element.position[0] === newX && element.position[1] === newY) {
        mobCheck = true;
      }
    }
    for (let element of game.tree) {
      if (element[0] === newX && element[1] === newY) {
        treeCheck = true;
      }
    }
    for (let element of game.castle) {
      if (element[0] === newX && element[1] === newY) {
        castleCheck = true;
      }
    }

    // check if Gate

    for (let element of game.gates) {
      if (element[0] === newX && element[1] === newY) {
        gateCheck = true;
      }
    }

    console.log("prout0");
    // Set up Board Type
    if (game.boardType === 2) {
      /* Prout*/
      console.log("prout1");
    } else if ((game.boardType = 1)) {
      game.boardType = 2;
      console.log("prout3");
    } else if (game.waveNum === 2) {
      game.boardType = 1;
      console.log("prout2");
    }

    // DOING
    if (gateCheck === true) {
      game.newBoard([newX, newY]);
    } else if (
      newX === 0 ||
      newY === 0 ||
      newX > game.boardSize[0] ||
      newY > game.boardSize[1] ||
      mobCheck === true ||
      treeCheck === true ||
      castleCheck === true
    ) {
      oldHeroCard.className += ` hero hero-${dir}`;
    } else {
      this.position = [newX, newY];
      let newHeroCard = document.getElementById([newX, newY]);
      newHeroCard.className += ` hero hero-${dir}`;
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
        element.life -= this.strength;
        if (element.life <= 0) {
          const mobCard = document.getElementById(element.position);
          let newMobCard = mobCard.className.replace("mob", "");
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

    // Clear Hero skin
    setTimeout(() => {
      heroCard.className = oldClass;
    }, 50);
  }
}
