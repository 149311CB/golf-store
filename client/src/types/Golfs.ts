export interface IGolfProperty {
  _id: string;
  visualDisabled?: boolean;
  disabled?: boolean;
}

export class Hand implements IGolfProperty {
  _id: string;
  side: string;
  visualDisabled?: boolean;
  disabled?: boolean;

  constructor({ _id, side, visualDisabled = false, disabled = false }: Hand) {
    this._id = _id;
    this.side = side;
    this.visualDisabled = visualDisabled;
    this.disabled = disabled;
  }
}

export class Loft implements IGolfProperty {
  _id: string;
  type: number;
  visualDisabled?: boolean | undefined;
  disabled?: boolean;

  constructor({ _id, type, visualDisabled = false, disabled = false }: Loft) {
    this._id = _id;
    this.type = type;
    this.visualDisabled = visualDisabled;
    this.disabled = disabled;
  }
}

export class Flex implements IGolfProperty {
  _id: string;
  type: number;
  visualDisabled?: boolean | undefined;
  disabled?: boolean;

  constructor({ _id, type, visualDisabled = false, disabled = false }: Flex) {
    this._id = _id;
    this.type = type;
    this.visualDisabled = visualDisabled;
    this.disabled = disabled;
  }
}

export class Shaft implements IGolfProperty {
  _id: string;
  name: string;
  image: string;
  visualDisabled?: boolean | undefined;
  disabled: boolean;

  constructor({
    _id,
    name,
    image,
    visualDisabled = false,
    disabled = false,
  }: Shaft) {
    this._id = _id;
    this.visualDisabled = visualDisabled;
    this.name = name;
    this.image = image;
    this.disabled = disabled;
  }
}

export class Variant {
  _id: string;
  hand: Hand | null;
  loft: Loft | null;
  flex: Flex | null;
  shaft: Shaft | null;
  stock: number;

  constructor({ _id, hand, loft, flex, shaft, stock }: Variant | any) {
    this._id = _id;
    this.hand = hand;
    this.loft = loft;
    this.flex = flex;
    this.shaft = shaft;
    this.stock = stock;
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

export class Golf {
  _id: string;
  name: string;
  images: string[];
  longName: string;
  price: number;
  sku: string;
  description: string;
  constructor({ _id, name, images, longName, price, sku, description }: Golf) {
    this._id = _id;
    this.name = name;
    this.images = images;
    this.longName = longName;
    this.price = price;
    this.sku = sku;
    this.description = description;
  }
}
