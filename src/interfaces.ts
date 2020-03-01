import { ShipLetter, Letter } from "./enums";

export interface Shot {
    letter: Letter;
    index: number;
}

export interface ShipPart extends Shot {
    isHit?: boolean;
    shipLetter?: ShipLetter;
}
