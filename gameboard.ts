import { Ship, ShipPart, Letter, ShipLetter } from "./battleship";

const computerBoard1 = `
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

const computerBoard2 = `
    1 2 3 4 5 6 7 8 
  A 0 P 0 0 0 0 0 0
  B 0 P 0 0 0 0 0 0
  C 0 0 0 0 D 0 0 0
  D 0 0 0 D D S 0 0
  E 0 0 A A A S 0 0
  F 0 0 A 0 0 S 0 0
  G 0 B B 0 0 0 0 0
  H B B 0 0 0 0 0 0
`;

const computerBoard3 = `
    1 2 3 4 5 6 7 8 
  A D D D 0 0 0 0 P
  B 0 0 0 0 0 0 0 P
  C 0 0 0 A 0 0 0 0
  D 0 0 0 A 0 S 0 0
  E 0 B A A 0 S S 0
  F 0 B 0 0 0 0 0 0
  G 0 B B 0 0 0 0 0
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
  ships: GameBoardShips;
  boardwidth = 8;
  boardHeight = 8;

  parseShipPart(letterRow: number, i: number): ShipPart {
    return { letter: 'ABCDEFGH'[letterRow] as Letter, index: (i - (26 + letterRow * 20)) / 2 + 1 };
  }

  parseBoard(boardStr: string, boardFunc: any): [string, GameBoardShips] {
    let letterRow = 0;
    const aircraftCarrier: Array<ShipPart> = [];
    const battleship: Array<ShipPart> = [];
    const submarine: Array<ShipPart> = [];
    const destroyer: Array<ShipPart> = [];
    const patrolBoat: Array<ShipPart> = [];
    let updatedBoard = boardStr;
    const ships: GameBoardShips = {
      aircraftCarrier,
      battleship,
      submarine,
      destroyer,
      patrolBoat
    };

    for (let i = 24; i < boardStr.length; i += 2) {
      const boardLetter = boardStr[i];
      if (i >= 26 + letterRow * 20 && i <= 40 + letterRow * 20) {
        updatedBoard = boardFunc(updatedBoard, ships, boardLetter, letterRow, i);
      }

      if (i === 40 + letterRow * 20) {
        letterRow++;
      }
    }
    return [updatedBoard, ships];
  }


  initialiseBoard(boardStr: string) {
    const initialiseBoardFunc = (boardStr: string, gameShips: GameBoardShips, boardLetter: ShipLetter, letterRow: number, i: number): string => {
      if (boardLetter === ShipLetter.A) {
        gameShips.aircraftCarrier.push(this.parseShipPart(letterRow, i));
      }

      if (boardLetter === ShipLetter.B) {
        gameShips.battleship.push(this.parseShipPart(letterRow, i));
      }

      if (boardLetter === ShipLetter.S) {
        gameShips.submarine.push(this.parseShipPart(letterRow, i));
      }

      if (boardLetter === ShipLetter.D) {
        gameShips.destroyer.push(this.parseShipPart(letterRow, i));
      }

      if (boardLetter === ShipLetter.P) {
        gameShips.patrolBoat.push(this.parseShipPart(letterRow, i));
      }

      return boardStr;
    };

    const [, ships] = this.parseBoard(boardStr, initialiseBoardFunc);

    this.ships = ships;
  }

  serialiseBoard(): string {
    const getAllShipParts = () => {
      let parts: Array<ShipPart> = [];
      for (const shipKey of Object.keys(this.ships)) {
        const ship: Array<ShipPart> = this.ships[shipKey];
        const letterShipPart: Array<ShipPart> = ship.map(el => ({ ...el, shipLetter: shipKey[0].toUpperCase() as ShipLetter }));
        parts = parts.concat(letterShipPart);
      }

      return parts;
    }

    const allShipParts = getAllShipParts();

    const serialiseBoardFunc = (boardStr: string, gameShips: GameBoardShips, boardLetter: ShipLetter, letterRow: number, i: number): string => {
      const possibleShipPart = this.parseShipPart(letterRow, i);
      const existingShipPart = allShipParts.find(el => el.letter === possibleShipPart.letter && el.index === possibleShipPart.index);
      if (existingShipPart) {
        return boardStr.substr(0, i) + existingShipPart.shipLetter + boardStr.substr(i + 1);
      }
      return boardStr;
    };


    const [serialisedStr] = this.parseBoard(emptyBoard, serialiseBoardFunc);

    return serialisedStr;
  }
}

const computerBoards = [computerBoard1, computerBoard2, computerBoard3];

const getRandomComputerBoard = () => {
  const index = Math.round(Math.random() * 10) % computerBoards.length;
  return computerBoards[index];
}

const computerGameBoard = new GameBoard();
const computerBoard = getRandomComputerBoard();
computerGameBoard.initialiseBoard(computerBoard);
console.log(computerGameBoard.ships);
console.log(computerBoard);
console.log(computerBoard === computerGameBoard.serialiseBoard());
console.log(computerGameBoard.serialiseBoard());

