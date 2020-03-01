import { Ship, Color, Letter } from './battleship';

describe('Battleship', () => {
    describe('Ship', () => {
        let shipColor: Color;
        let destroyer: Ship;
        beforeEach(() => {
            shipColor = Color.purple;
            destroyer = new Ship('Destroyer', 3, shipColor);
            destroyer.addPart({ letter: Letter.A, index: 4});
            destroyer.addPart({ letter: Letter.A, index: 5});
            destroyer.addPart({ letter: Letter.B, index: 5})
        });

        test('should initialise', () => {
            expect(destroyer.serialise()).toEqual(JSON.stringify({
                name: 'Destroyer',
                size: 3,
                color: shipColor,
                parts: [{ letter: Letter.A, index: 4, isHit: false},
                    { letter: Letter.A, index: 5, isHit: false},
                    { letter: Letter.B, index: 5, isHit: false}]
            }, null, 2));

            expect(destroyer.isDestroyed).toBe(false);
        });

        test('should be able to miss shot', () => {
            // Act
            destroyer.tryHitTheShip({ letter: Letter.C, index: 4});
            destroyer.tryHitTheShip({ letter: Letter.G, index: 6});

            // Arrange
            expect(destroyer.serialise()).toEqual(JSON.stringify({
                name: 'Destroyer',
                size: 3,
                color: shipColor,
                parts: [{ letter: Letter.A, index: 4, isHit: false},
                    { letter: Letter.A, index: 5, isHit: false},
                    { letter: Letter.B, index: 5, isHit: false}]
            }, null, 2));

            expect(destroyer.isDestroyed).toBe(false);
        });

        test('should be able to hit shot', () => {
            // Act
            destroyer.tryHitTheShip({ letter: Letter.A, index: 4});
            destroyer.tryHitTheShip({ letter: Letter.B, index: 5});

            // Arrange
            expect(destroyer.serialise()).toEqual(JSON.stringify({
                name: 'Destroyer',
                size: 3,
                color: shipColor,
                parts: [{ letter: Letter.A, index: 4, isHit: true},
                    { letter: Letter.A, index: 5, isHit: false},
                    { letter: Letter.B, index: 5, isHit: true}]
            }, null, 2));

            expect(destroyer.isDestroyed).toBe(false);
        });

        test('should be able to destroy ship', () => {
            // Act
            destroyer.tryHitTheShip({ letter: Letter.A, index: 4});
            destroyer.tryHitTheShip({ letter: Letter.A, index: 5});
            destroyer.tryHitTheShip({ letter: Letter.B, index: 5});

            // Arrange
            expect(destroyer.serialise()).toEqual(JSON.stringify({
                name: 'Destroyer',
                size: 3,
                color: shipColor,
                parts: [{ letter: Letter.A, index: 4, isHit: true},
                    { letter: Letter.A, index: 5, isHit: true},
                    { letter: Letter.B, index: 5, isHit: true}]
            }, null, 2));

            expect(destroyer.isDestroyed).toBe(true);
        });
    });
});