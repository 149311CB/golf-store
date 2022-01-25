import {
  Hand,
  Loft,
  Flex,
  Shaft,
  Variant,
  IGolfProperty,
  TransformedData,
} from "../types/Golfs";

export class VariantStore {
  private static instance: VariantStore;

  public variants: Variant[] = [];
  public activeVariants: Variant[] = this.variants;
  public disabledVariants: Variant[] | any = [];
  public choosenVariant: Variant = new Variant({
    hand: null,
    loft: null,
    flex: null,
    shaft: null,
  });

  public transformedData: TransformedData = new TransformedData();

  private constructor() { }

  public static getInstance(reset: boolean = false): VariantStore {
    if (!this.instance || reset) {
      this.instance = new VariantStore();
    }
    return this.instance;
  }
}

const transform = (value: IGolfProperty | any, type: "hands" | "flexes" | "shafts" | "lofts") => {
  var instance = VariantStore.getInstance();
  if (!instance.transformedData[type] || !instance.transformedData[type].get(value._id)) {
    instance.transformedData[type].set(value._id, {
      ...value,
      disabled: false,
    });
  }
};

const transformCaller = () => {
  var instance = VariantStore.getInstance();
  instance.variants?.forEach((variant: Variant) => {
    transform(variant.hand, "hands");
    transform(variant.loft, "lofts");
    transform(variant.flex, "flexes");
    transform(variant.shaft, "shafts");
  });
};

export const transformData = (data: any): TransformedData => {
  var instance = VariantStore.getInstance();

  instance.variants = [];
  instance.disabledVariants = []
  instance.transformedData = new TransformedData()
  instance.choosenVariant = new Variant({
    hand: null,
    loft: null,
    flex: null,
    shaft: null,
  });
  data.forEach((variant: any) => {
    instance.variants?.push(
      new Variant({
        _id: variant._id,
        hand: new Hand({ ...variant.hand }),
        loft: new Loft({ ...variant.loft }),
        flex: new Flex({ ...variant.flex }),
        shaft: new Shaft({ ...variant.shaft }),
        stock: variant.stock,
      })
    );
  });
  instance.activeVariants = instance.variants;
  transformCaller();
  return instance.transformedData;
};
