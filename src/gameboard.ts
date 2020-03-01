import { Letter, ShipLetter } from "./enums";
import { ShipPart, Shot } from "./interfaces";

const LETTERS = 'ABCDEFGH';
const BOARD_SIZE = 8;

export const computerBoard = `
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


export interface GameBoardShips {
  aircraftCarrier: Array<ShipPart>;
  battleship: Array<ShipPart>;
  submarine: Array<ShipPart>;
  destroyer: Array<ShipPart>;
  patrolBoat: Array<ShipPart>;
}

const shipLetterToKeyMap = {
  A: 'aircraftCarrier',
  B: 'battleship',
  S: 'submarine',
  D: 'destroyer',
  P: 'patrolBoat'
}

export const isValidPosition = (positionStr: string) => {
  return positionStr.length === 2 && LETTERS.indexOf(positionStr[0].toUpperCase()) > -1 && Number(positionStr[1]) <= BOARD_SIZE;
};

export class GameBoard {
  ships: GameBoardShips = {
    aircraftCarrier: [],
    battleship: [],
    submarine: [],
    destroyer: [],
    patrolBoat: []
  };
  gameDimension = 8; // 8x8

  parseShipPart(letterRow: number, i: number): ShipPart {
    return { letter: LETTERS[letterRow] as Letter, index: (i - (26 + letterRow * (this.gameDimension + 2) * 2)) / 2 + 1 };
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

  tryHitAShip(shot: Shot) {
    const hitPart = this.getAllShipParts().find(el => el.letter === shot.letter && el.index === shot.index);
    if (hitPart) {
      hitPart.isHit = true;
      return true;
    }

    return false;
  }

  getAllShipParts() {
    let parts: Array<ShipPart> = [];
    for (const shipKey of Object.keys(this.ships)) {
      const ship: Array<ShipPart> = this.ships[shipKey];
      const letterShipPart: Array<ShipPart> = ship.map(el => ({ ...el, shipLetter: shipKey[0].toUpperCase() as ShipLetter }));
      parts = parts.concat(letterShipPart);
    }

    return parts;
  }

  serialiseBoard(): string {
    const allShipParts = this.getAllShipParts();

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

  initialiseShip(shipLetter: ShipLetter, shipPartStr: string, size: number) {
    const shipPartPosition = shipPartStr.split(',').map(el => el.trim());
    if (shipPartPosition.length !== size) {
      throw Error(`Ship requires exactly ${size} parts`);
    }

    const shipParts: Array<ShipPart> = shipPartPosition.map(el => {
      if (!isValidPosition(el)) {
        throw Error('Invalid ship position');
      }
      const letter = el[0].toUpperCase() as Letter;
      const index = Number(el[1]);
      return { letter, index, shipLetter, isHit: false };
    });
    this.ships[shipLetterToKeyMap[shipLetter]] = shipParts;
  }

  getRandomPosition() {
    const letterIndex = Math.round(Math.random() * 10) % LETTERS.length;
    const index = Math.round(Math.random() * 10) % BOARD_SIZE;
    return LETTERS[letterIndex] + (index + 1);
  }
}
