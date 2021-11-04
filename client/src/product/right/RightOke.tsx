import React, { useEffect, useState } from "react";
import OptionGroup from "../../components/option/OptionGroup";
import Option from "../../components/option/Option";

interface Props {
  data: any;
}

const checkIfExits = (value: any, arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (value._id === arr[i]._id) {
      return true;
    }
  }
  return false;
};

const Right: React.FC<Props> = ({ data }) => {
  const { golf, variants } = data;
  const [selectedVariant, setSelectedVariant] = useState<any>({
    hand: "right",
    loft: null,
    flex: null,
    shaft: null,
  });
  console.log(selectedVariant);

  const [hands, setHands] = useState<any[]>([]);
  const [lofts, setLofts] = useState<any[]>([]);
  const [flexs, setFlexs] = useState<any>([]);
  const [shafts, setShafts] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedVariant) return;
    console.log("run");
    const activeVariantArr: any[] = [];
    const disabledVariantArr: any[] = [];
    variants.forEach((variant: any) => {
      if (
        selectedVariant.hand !== null &&
        variant.hand !== selectedVariant.hand
      ) {
        disabledVariantArr.push(variant);
        return;
      }
      if (
        selectedVariant.loft !== null &&
        variant.loft._id !== selectedVariant.loft
      ) {
        disabledVariantArr.push(variant);
        return;
      }

      if (
        variant.flex !== selectedVariant.flex &&
        selectedVariant.flex !== null
      ) {
        disabledVariantArr.push(variant);
        return;
      }
      activeVariantArr.push(variant);
    });
    console.log(disabledVariantArr);
    generateOptions(activeVariantArr, disabledVariantArr);
  }, [selectedVariant]);

  const generateOptions = (activeVariants: any, disabledVariants: any) => {
    if (activeVariants.length === 0) return;

    const flexsSet: any[] = [];
    const loftsSet: any[] = [];
    const handsSet: any[] = [];
    const shaftsSet: any[] = [];

    activeVariants.forEach((active: any) => {
      if (handsSet.length === 0) {
        handsSet.push({ side: active.hand, disabled: false });
      } else {
        handsSet.forEach((hand: any) => {
          if (active.hand !== hand.side) {
            handsSet.push({ side: active.hand, disabled: false });
          }
        });
      }
      if (!checkIfExits(active.loft, loftsSet)) {
        loftsSet.push({ ...active.loft, disabled: false });
      }

      if (!checkIfExits(active.flex, flexsSet)) {
        flexsSet.push({ ...active.flex, disabled: false });
      }
    });

    disabledVariants.forEach((disabled: any) => {
      handsSet.forEach((hand: any) => {
        if (disabled.hand !== hand.side) {
          handsSet.push({ side: disabled.hand, disabled: true });
        }
      });
      if (!checkIfExits(disabled.loft, loftsSet)) {
        loftsSet.push({ ...disabled.loft, disabled: true });
      }
      if (!checkIfExits(disabled.flex, flexsSet)) {
        flexsSet.push({ ...disabled.flex, disabled: true });
      }
    });
    setHands(handsSet.sort((a, b) => a.side - b.side));
    setLofts(loftsSet.sort((a, b) => a.type - b.type));
    setFlexs(flexsSet);
  };

  return (
    <div className={"right"}>
      <OptionGroup>
        {hands.map((hand: any) => (
          // @ts-ignore
          <Option
            visualDisabled={hand.disabled}
            onClick={() =>
              setSelectedVariant((variant: any) => {
                return { ...variant, hand: hand.side };
              })
            }
          >
            {hand.side}
          </Option>
        ))}
      </OptionGroup>
      <OptionGroup disableAutoSelect>
        {lofts.map((loft: any) => (
          <Option
            visualDisabled={loft.disabled}
            onClick={() =>
              setSelectedVariant((variant: any) => {
                return { ...variant, loft: loft._id };
              })
            }
          >
            {loft.type}
          </Option>
        ))}
      </OptionGroup>
      <OptionGroup disableAutoSelect>
        {flexs.map((flex: any) => (
          <Option
            visualDisabled={flex.disabled}
            onClick={() =>
              setSelectedVariant((variant: any) => {
                return { ...variant, flex: flex._id };
              })
            }
          >
            {flex.type}
          </Option>
        ))}
      </OptionGroup>
    </div>
  );
};

export default Right;
