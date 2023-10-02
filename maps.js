function genMap(mapNumb, mapSize) {
  console.log(mapNumb);

  for (let i = 1; i <= mapSize[0]; i++) {
    for (let j = 1; j <= mapSize[1]; j++) {
      game.boards.push([i, j]);
      let divCard = document.createElement("div");
      board.appendChild(divCard);
      divCard.className = "board-card";
      divCard.id = [i, j];
      let width = 100 / game.boardSize[1];
      let height = 80 / game.boardSize[0];
      divCard.style.width = `${width}%`;
      divCard.style.height = `${height}vh`;
    }
  }

  //////////// RANDOM MAP ////////////
  if (mapNumb === 0) {
    // Prout
  }

  //////////// CASTLE - OUTSIDE ////////////
  else if (mapNumb === 1) {
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
    gateCard.className += " castle gate";
  }

  //////////// CASTLE - INSIDE ////////////
  else if (mapNumb === 2) {
    let divCard = document.getElementById("board");
    divCard.className += "-castle";
  }
}
