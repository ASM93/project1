function genMap(mapNumb, mapSize, startPosition) {
  //////////// INIT ////////////

  for (let i = 1; i <= mapSize[0]; i++) {
    for (let j = 1; j <= mapSize[1]; j++) {
      game.boards.push([i, j]);
      let divCard = document.createElement("div");
      board.appendChild(divCard);
      divCard.className = "board-card";
      divCard.id = [i, j];
      let width = 100 / game.boardSize[1];
      let height = 78 / game.boardSize[0];
      divCard.style.width = `${width}%`;
      divCard.style.height = `${height}vh`;
    }
  }
  let noCard = [];
  noCard.push(
    startPosition,
    [startPosition[0] + 1, startPosition[1]], //hero position top
    [startPosition[0] - 1, startPosition[1]], //hero position down
    [startPosition[0], startPosition[1] + 1], //hero position right
    [startPosition[0], startPosition[1] - 1], //hero position left
    [2, Math.round(game.boardSize[0] / 2)], //top gate
    [Math.round(game.boardSize[0]) - 1, Math.round(game.boardSize[1] / 2)], //down gate
    [Math.round(game.boardSize[0] / 2), 2], //right gate
    [Math.round(game.boardSize[0] / 2), 20] //left gate
  );

  //////////// FOREST ////////////
  if (mapNumb === 0) {
    //****PACKAGE ****//
    game.spawnTree(noCard);
    game.spawnGates(startPosition);
    game.spawnMob();
  }

  //////////// CASTLE - OUTSIDE ////////////
  else if (mapNumb === 1) {
    // Castle
    let castleDim = [10, 10];
    for (let element of game.boards) {
      if (
        element[0] > (mapSize[0] - castleDim[0]) / 4 &&
        element[0] <
          (mapSize[0] - castleDim[0] + (mapSize[0] - castleDim[0])) / 2 &&
        element[1] > (mapSize[1] - castleDim[1]) / 2 &&
        element[1] < mapSize[1] - castleDim[1] + (mapSize[1] - castleDim[1]) / 2
      ) {
        game.castle.push([element[0], element[1]]);
        noCard.push([element[0], element[1]]);
        let castleCard = document.getElementById(element);
        castleCard.className += " castle";
      }
    }

    //Castle Gate
    let castleGateX =
      (mapSize[0] - castleDim[0] + (mapSize[0] - castleDim[0])) / 2 - 1;
    let castleGateY = Math.round(mapSize[1] / 2);
    let castleGate = [castleGateX, castleGateY];
    game.gates.push(castleGate);

    const gateCard = document.getElementById([castleGateX, castleGateY]);
    gateCard.className = " castle gate";

    //****PACKAGE ****//

    noCard.push(castleGate, [castleGateX + 1, castleGateY]);
    game.spawnTree(noCard);
    game.spawnGates(startPosition);
    game.spawnMob();
  }

  //////////// CASTLE - INSIDE ////////////
  else if (mapNumb === 2) {
    game.spawnWalls();
    game.spawnTree(noCard);
    let boardCard = document.getElementById("board");
    boardCard.className = "board-castle";
    for (let element of game.tree) {
      let treeCard = document.getElementById(element);
      let newTreeCard = treeCard.className.replace("tree", "castle");
      treeCard.className = newTreeCard;
    }

    //****PACKAGE ****//
    game.spawnGates(startPosition);
    game.spawnMob();

    // setTimeout(() => {
    //   for (let element of game.mobs) {
    //     let mobCard = document.getElementById(element.position);
    //     mobCard.className += " mob-red";
    //   }
    // }, 600);
  }

  //////////// CASTLE - BOSS ////////////
  else if (mapNumb === 3) {
    game.spawnWalls();
    game.spawnBoss();
    let boardCard = document.getElementById("board");
    boardCard.className = "board-castle";
    for (let element of game.tree) {
      let treeCard = document.getElementById(element);
      let newTreeCard = treeCard.className.replace("tree", "castle");
      treeCard.className = newTreeCard;
    }
  }
}
