import { ShipLetter } from './enums';
import { GameBoard } from './gameboard';

const sampleBoard = `
    1 2 3 4 5 6 7 8 
  A 0 0 0 B B B 0 0
  B 0 0 0 0 0 B 0 0
  C 0 0 0 0 0 0 D 0
  D 0 0 0 A A 0 D D
  E 0 0 0 0 A A 0 0
  F 0 0 0 0 0 A P P
  G 0 0 0 0 0 S S 0
  H 0 0 0 0 0 0 S 0
`;

describe('Gameboard', () => {
    let computerGameBoard: GameBoard;
    beforeEach(() => {
        computerGameBoard = new GameBoard();
    });

    test('should initialise gameboard', () => {
        // Act
        computerGameBoard.initialiseBoard(sampleBoard);

        // Assert
        expect(computerGameBoard.ships.aircraftCarrier).toEqual([
            { 'index': 4, 'letter': 'D' },
            { 'index': 5, 'letter': 'D' },
            { 'index': 5, 'letter': 'E' },
            { 'index': 6, 'letter': 'E' },
            { 'index': 6, 'letter': 'F' }]);

        expect(computerGameBoard.ships.battleship).toEqual([
            { 'index': 4, 'letter': 'A' },
            { 'index': 5, 'letter': 'A' },
            { 'index': 6, 'letter': 'A' },
            { 'index': 6, 'letter': 'B' }]);

        expect(computerGameBoard.ships.destroyer).toEqual([
            { 'index': 7, 'letter': 'C' },
            { 'index': 7, 'letter': 'D' },
            { 'index': 8, 'letter': 'D' }]);

        expect(computerGameBoard.ships.patrolBoat).toEqual([
            { 'index': 7, 'letter': 'F' },
            { 'index': 8, 'letter': 'F' }]);

        expect(computerGameBoard.ships.submarine).toEqual([
            { 'index': 6, 'letter': 'G' },
            { 'index': 7, 'letter': 'G' },
            { 'index': 7, 'letter': 'H' }]);
    });

    test('should serialise', () => {
        // Act
        computerGameBoard.initialiseBoard(sampleBoard);
        // Assert
        expect(sampleBoard).toEqual(computerGameBoard.serialiseBoard())
    });

    test('should initialise aircraftCarrier individually', () => {
        // Act
        computerGameBoard.initialiseShip(ShipLetter.A, 'B1, B2, B3, C3, D4', 5);
        // Assert
        expect(computerGameBoard.ships.aircraftCarrier).toEqual([
            { 'index': 1, 'isHit': false, 'letter': 'B', 'shipLetter': 'A' },
            { 'index': 2, 'isHit': false, 'letter': 'B', 'shipLetter': 'A' },
            { 'index': 3, 'isHit': false, 'letter': 'B', 'shipLetter': 'A' },
            { 'index': 3, 'isHit': false, 'letter': 'C', 'shipLetter': 'A' },
            { 'index': 4, 'isHit': false, 'letter': 'D', 'shipLetter': 'A' }]);
    });

    test('should initialise battleship individually', () => {
        // Act
        computerGameBoard.initialiseShip(ShipLetter.B, 'G3, G4, H4, H5', 4);
        // Assert
        expect(computerGameBoard.ships.battleship).toEqual([
            { 'index': 3, 'isHit': false, 'letter': 'G', 'shipLetter': 'B' },
            { 'index': 4, 'isHit': false, 'letter': 'G', 'shipLetter': 'B' },
            { 'index': 4, 'isHit': false, 'letter': 'H', 'shipLetter': 'B' },
            { 'index': 5, 'isHit': false, 'letter': 'H', 'shipLetter': 'B' }]);
    });

    test('should initialise destroyer individually', () => {
        // Act
        computerGameBoard.initialiseShip(ShipLetter.D, 'E4, E5, E6', 3);
        // Assert
        expect(computerGameBoard.ships.destroyer).toEqual([
            { 'index': 4, 'isHit': false, 'letter': 'E', 'shipLetter': 'D' },
            { 'index': 5, 'isHit': false, 'letter': 'E', 'shipLetter': 'D' },
            { 'index': 6, 'isHit': false, 'letter': 'E', 'shipLetter': 'D' }]);
    });

    test('should initialise patrol boat individually', () => {
        // Act
        computerGameBoard.initialiseShip(ShipLetter.P, 'A8, B8', 2);
        // Assert
        expect(computerGameBoard.ships.patrolBoat).toEqual([
            { 'index': 8, 'isHit': false, 'letter': 'A', 'shipLetter': 'P' },
            { 'index': 8, 'isHit': false, 'letter': 'B', 'shipLetter': 'P' }]);
    });

    test('should initialise submarine individually', () => {
        // Act
        computerGameBoard.initialiseShip(ShipLetter.S, 'A1, B1, C1', 3);
        // Assert
        expect(computerGameBoard.ships.submarine).toEqual([
            { 'index': 1, 'isHit': false, 'letter': 'A', 'shipLetter': 'S' },
            { 'index': 1, 'isHit': false, 'letter': 'B', 'shipLetter': 'S' },
            { 'index': 1, 'isHit': false, 'letter': 'C', 'shipLetter': 'S' }]);
    });


    test('should throw error if ship string and size do not match', () => {
        const wrongSize = 3;
        try {
            computerGameBoard.initialiseShip(ShipLetter.B, 'G3, G4, H4, H5', wrongSize);
        } catch (err) {
            expect(err).toEqual(new Error(`Ship requires exactly ${wrongSize} parts`));
        }
    });
    test('should throw error if ship string is invalid', () => {
        try {
            computerGameBoard.initialiseShip(ShipLetter.B, 'G3, X4, H4, H5', 4);
        } catch (err) {
            expect(err).toEqual(new Error('Invalid ship position'));
        }
    });
});