import { Ship, ShipPart, Letter } from "./battleship";

const computerBoard = `
    1 2 3 4 5 6 7 8 
  A 0 0 0 B B 0 0 0
  B 0 0 0 B B 0 0 0
  C 0 0 0 0 0 0 D D
  D 0 0 0 0 0 0 0 D
  E 0 0 A A A A 0 0
  F S S S 0 0 A P P
  G 0 0 0 0 0 0 0 0
  H 0 0 0 0 0 0 0 0
`;

const emptyBoard = `
    1 2 3 4 5 6 7 8 
  A 0 0 0 0 0 0 0 0
  B 0 0 0 0 0 0 0 0
  C 0 0 0 0 0 0 0 0
  D 0 0 0 0 0 0 0 0
  E 0 0 0 0 0 0 0 0
  F 0 0 0 0 0 0 0 0
  G 0 0 0 0 0 0 0 0
  H 0 0 0 0 0 0 0 0
`;


interface GameBoardShips {
  aircraftCarrier: Array<ShipPart>;
  battleship: Array<ShipPart>;
  submarine: Array<ShipPart>;
  destroyer: Array<ShipPart>;
  patrolBoat: Array<ShipPart>;
}

export class GameBoard {
  ships: GameBoardShips
  boardwidth = 8;
  boardHeight = 8;

  parseShipPart(letterRow: number, i: number): ShipPart {
    return { letter: 'ABCDEFGH'[letterRow] as Letter, index: (i - (26 + letterRow * 20)) / 2 + 1 };
  }
  
  initialiseBoard(boardStr: string) {
    let letterRow = 0;
    const aircraftCarrier: Array<ShipPart> = [];
    const battleship: Array<ShipPart> = [];
    const submarine: Array<ShipPart> = [];
    const destroyer: Array<ShipPart> = [];
    const patrolBoat: Array<ShipPart> = [];

    for (let i = 24; i < boardStr.length; i += 2) {
      const boardLetter = boardStr[i];
      if (i >= 26 + letterRow * 20 && i <= 40 + letterRow * 20) {
        if (boardLetter === 'A') {
          aircraftCarrier.push(this.parseShipPart(letterRow, i));
        }

        if (boardLetter === 'B') {
          battleship.push(this.parseShipPart(letterRow, i));
        }

        if (boardLetter === 'S') {
          submarine.push(this.parseShipPart(letterRow, i));
        }

        if (boardLetter === 'D') {
          destroyer.push(this.parseShipPart(letterRow, i));
        }

        if (boardLetter === 'P') {
          patrolBoat.push(this.parseShipPart(letterRow, i));
        }
      }

      if (i === 40 + letterRow * 20) {
        letterRow++;
      }
    }


    this.ships = {
      aircraftCarrier,
      battleship,
      submarine,
      destroyer,
      patrolBoat
    };

    console.log(JSON.stringify(this.ships));
  }
}

const computerGameBoard = new GameBoard();
computerGameBoard.initialiseBoard(computerBoard);

