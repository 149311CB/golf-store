import React, { CSSProperties, useEffect, useState } from "react";
import { transformData, VariantStore } from "../../hooks/useTransformData";
import {
  Hand,
  IGolfProperty,
} from "../../types/Golfs";
import { filterActive, filterDisabled } from "../../hooks/useFilterData";
import { Iterator, MapIterator } from "../../utils/iterator";
import Button from "../../components/button/Button";
import Hands from "./hands/Hands";
import Lofts from "./lofts/Lofts";
import FLexs from "./flexs/FLexs";
import Shafts from "./shafts/Shafts";

interface IProps {
  data: any;
}

export interface IGolfComponentsProps {
  values: Iterator | undefined;
  onPropertyChange: Function;
  groupStyle: CSSProperties;
  optionStyle: CSSProperties;
}

const groupStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: "0.9rem",
  marginBottom: "1rem",
};

const optionStyle: CSSProperties = {
  width: "80px",
  textAlign: "center",
};

const instance = VariantStore.getInstance();
const Right: React.FC<IProps> = ({ data }) => {
  const [hands, setHands] = useState<Iterator>();
  const [lofts, setLofts] = useState<Iterator>();
  const [flexs, setFlexs] = useState<Iterator>();
  const [shafts, setShafts] = useState<Iterator>();
  const [render, setRender] = useState(false);

  // manages states
  const setProperties = () => {
    const {
      hands: transformedHands,
      lofts: transformedLofts,
      flexs: transformedFlexs,
      shafts: transformedShafts,
    } = instance.transformedData;

    setHands(new MapIterator(transformedHands));
    setLofts(new MapIterator(transformedLofts));
    setFlexs(new MapIterator(transformedFlexs));
    setShafts(new MapIterator(transformedShafts));
    setRender((r) => !r);
  };

  const onPropertyChange = (property: IGolfProperty) => {
    const propertyName = property.constructor.name.toLowerCase();
    property?.disabled ? filterDisabled(property) : filterActive(property);

    // @ts-ignore
    instance.choosenVariant[propertyName] = property;
    setProperties();
  };

  // Only run whenever data changed to initialized states
  useEffect(() => {
    if (!data.variants) return;

    // Transform data and initialized states
    const instance = VariantStore.getInstance();
    transformData(data.variants);
    const { hands: transformedHands } = instance.transformedData;
    setProperties();

    // Set the first selected property using filterActive
    const firstHand = transformedHands.values().next();
    const hand = firstHand.value;
    filterActive(new Hand(hand));
  }, [data]);

  return (
    <div className={"right"}>
      <div className={"container"}>
        <Hands
          values={hands}
          onPropertyChange={onPropertyChange}
          groupStyle={groupStyle}
          optionStyle={optionStyle}
        />
        <Lofts
          values={lofts}
          onPropertyChange={onPropertyChange}
          groupStyle={groupStyle}
          optionStyle={optionStyle}
        />
        <FLexs
          values={flexs}
          onPropertyChange={onPropertyChange}
          groupStyle={groupStyle}
          optionStyle={optionStyle}
        />
        <Shafts
          values={shafts}
          onPropertyChange={onPropertyChange}
          groupStyle={groupStyle}
          optionStyle={optionStyle}
        />
        <Button
          className={"checkout-btn"}
          style={{
            marginTop: "1.3rem",
            padding: "1rem 0",
            width: "100%",
            fontWeight: "bold",
          }}
          onClick={() => {
            console.log(instance.choosenVariant);
          }}
        >
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
};

export default Right;
