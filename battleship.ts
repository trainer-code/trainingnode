
export enum Color {
    red = 'red',
    green = 'green',
    blue = 'blue',
    yellow = 'yellow',
    purple = 'purple'
}

export enum Letter {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H'
}

export interface Shot {
    letter: Letter;
    index: number;
}

export interface ShipPart extends Shot {
    isHit?: boolean;
}


 export class Ship {
    parts: Array<ShipPart> = [];

    constructor(public name: string, public size: number, public color: Color) {

    }

    addPart(part: ShipPart) {
        if (this.parts.length < this.size) {
            this.parts.push({...part, isHit: false});
        } else {
            console.log('You cannot add extra part greater than allowed')
        }
        
    }

    tryHitTheShip(shot: Shot) {
        const hitPart = this.parts.find(el => el.letter === shot.letter && el.index === shot.index);
        if (hitPart) {
            hitPart.isHit = true;
            return true;
        }

        return false;
    }

    public get isDestroyed(): boolean {
        return  this.parts.length > 0 && this.parts.filter(el => el.isHit).length === this.parts.length;
    }

    serialise() {
        return JSON.stringify({
            name: this.name,
            size: this.size,
            color: this.color,
            parts: this.parts
        }, null, 2);
    }
}


