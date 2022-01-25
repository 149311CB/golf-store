import { Variant, IGolfProperty } from "../types/Golfs";
import { VariantStore } from "../hooks/useTransformData";

const instance = VariantStore.getInstance();

export const filterActive = (choosenPropety: IGolfProperty | null, type: "hand" | "loft" | "shaft" | "flex") => {
  if (!choosenPropety) return;
  instance.activeVariants = instance.activeVariants?.filter((variant: Variant) => {
    if (choosenPropety !== null &&
      variant[type]._id === choosenPropety._id
    ) {
      return true;
    }
    instance.disabledVariants.push(variant);
    return false;
  });
  changeActive();
};

export const filterDisabled = (choosenPropety: IGolfProperty | null, type: "hand" | "loft" | "flex" | "shaft") => {
  instance.activeVariants = instance.variants;
  instance.disabledVariants = [];
  filterActive(choosenPropety, type);
};

const changeActive = () => {
  instance.disabledVariants.forEach((variant: Variant) => {
    //@ts-ignore
    const hand = instance.transformedData.hands.get(variant.hand?._id);
    //@ts-ignore
    const loft = instance.transformedData.lofts.get(variant.loft?._id);
    // @ts-ignore
    const flex = instance.transformedData.flexes.get(variant.flex?._id);
    // @ts-ignore
    const shaft = instance.transformedData.shafts.get(variant.shaft?._id);

    if (variant.stock <= 0) {
      if (hand) hand.disabled = true;
      if (loft) loft.disabled = true;
      if (flex) flex.disabled = true;
      if (shaft) shaft.disabled = true;
    } else {
      if (hand) hand.visualDisabled = true;
      if (loft) loft.visualDisabled = true;
      if (flex) flex.visualDisabled = true;
      if (shaft) shaft.visualDisabled = true;
    }
  });

  instance.activeVariants?.forEach((variant: Variant) => {
    const hand = instance.transformedData.hands.get(variant.hand?._id);
    //@ts-ignore
    const loft = instance.transformedData.lofts.get(variant.loft?._id);
    // @ts-ignore
    const flex = instance.transformedData.flexes.get(variant.flex?._id);
    // @ts-ignore
    const shaft = instance.transformedData.shafts.get(variant.shaft?._id);

    if (variant.stock <= 0) {
      if (hand) hand.disabled = false;
      if (loft) loft.disabled = false;
      if (flex) flex.disabled = false;
      if (shaft) shaft.disabled = false;
    } else {
      if (hand) hand.visualDisabled = false;
      if (loft) loft.visualDisabled = false;
      if (flex) flex.visualDisabled = false;
      if (shaft) shaft.visualDisabled = false;
    }
  });
};
