import { Golf, IGolfProperty } from "../types/Golfs";
import { VariantStore } from "../hooks/useTransformData";

const instance = VariantStore.getInstance();

export const filterActive = (choosenPropety: IGolfProperty | null) => {
  if (!choosenPropety) return;
  const propertyName = choosenPropety.constructor.name.toLowerCase();
  instance.activeVariants = instance.activeVariants.filter((variant: Golf) => {
    // @ts-ignore
    if (variant[propertyName]._id === choosenPropety._id) {
      return true;
    }
    instance.disabledVariants.push(variant);
    return false;
  });
  // @ts-ignore
  changeActive();
};

export const filterDisabled = (choosenPropety: IGolfProperty | null) => {
  instance.activeVariants = instance.variants;
  instance.disabledVariants = [];
  filterActive(choosenPropety);
};

const changeActive = () => {
  instance.disabledVariants.forEach((variant: Golf) => {
    //@ts-ignore
    instance.transformedData.hands.get(variant.hand?._id).disabled = true;
    //@ts-ignore
    instance.transformedData.lofts.get(variant.loft?._id).disabled = true;
    //@ts-ignore
    instance.transformedData.flexs.get(variant.flex?._id).disabled = true;
    //@ts-ignore
    instance.transformedData.shafts.get(variant.shaft?._id).disabled = true;
  });

  instance.activeVariants.forEach((variant: Golf) => {
    //@ts-ignore
    instance.transformedData.hands.get(variant.hand?._id).disabled = false;
    //@ts-ignore
    instance.transformedData.lofts.get(variant.loft?._id).disabled = false;
    //@ts-ignore
    instance.transformedData.flexs.get(variant.flex?._id).disabled = false;
    //@ts-ignore
    instance.transformedData.shafts.get(variant.shaft?._id).disabled = false;
  });
};
