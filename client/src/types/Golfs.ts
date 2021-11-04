export interface IGolfProperty {
  _id: string;
  disabled?: boolean;
}

export class Hand implements IGolfProperty {
  _id: string;
  disabled: boolean;
  side: string;
  constructor({ _id, side, disabled = false }: Hand) {
    this._id = _id;
    this.disabled = disabled;
    this.side = side;
  }
}

export class Loft implements IGolfProperty {
  _id: string;
  disabled?: boolean | undefined;
  type: number;

  constructor({ _id, type, disabled = false }: Loft) {
    this._id = _id;
    this.disabled = disabled;
    this.type = type;
  }
}

export class Flex implements IGolfProperty {
  _id: string;
  disabled?: boolean | undefined;
  type: number;
  constructor({ _id, type, disabled = false }: Flex) {
    this._id = _id;
    this.disabled = disabled;
    this.type = type;
  }
}

export class Shaft implements IGolfProperty {
  _id: string;
  disabled?: boolean | undefined;
  name: string;
  image: string;

  constructor({ _id, name, image, disabled = false }: Shaft) {
    this._id = _id;
    this.disabled = disabled;
    this.name = name;
    this.image = image;
  }
}

export class Golf {
  hand: Hand | null;
  loft: Loft | null;
  flex: Flex | null;
  shaft: Shaft | null;

  constructor({ hand, loft, flex, shaft }: Golf | any) {
    this.hand = hand;
    this.loft = loft;
    this.flex = flex;
    this.shaft = shaft;
  }
}

export class TransformedData {
  hands: Map<string, Hand>;
  lofts: Map<string, Loft>;
  flexs: Map<string, Flex>;
  shafts: Map<string, Shaft>;

  constructor() {
    this.hands = new Map();
    this.lofts = new Map();
    this.flexs = new Map();
    this.shafts = new Map();
  }

  sort() {
    return Array.from(this.lofts);
  }
}
