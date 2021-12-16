import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { transformData, VariantStore } from "../../hooks/useTransformData";
import { Variant, Hand, IGolfProperty } from "../../types/Golfs";
import { filterActive, filterDisabled } from "../../hooks/useFilterData";
import { Iterator, MapIterator } from "../../utils/iterator";
import Button from "../../components/button/Button";
import Hands from "./hands/Hands";
import Lofts from "./lofts/Lofts";
import FLexs from "./flexs/FLexs";
import Shafts from "./shafts/Shafts";
import { client } from "../../utils/client";
import { GlobalContext } from "../../App";

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

const verifyChoosenProduct = (instance: VariantStore): any => {
  const choosenVariant = instance.choosenVariant;

  const choosen: Variant | undefined = instance.activeVariants?.find(
    (variant: Variant) => {
      return (
        variant.hand?._id === choosenVariant.hand?._id &&
        choosenVariant.loft?._id === variant.loft?._id &&
        variant.flex?._id === choosenVariant.flex?._id &&
        variant.shaft?._id === choosenVariant.shaft?._id
      );
    }
  );
  if (choosen && choosen.stock > 0) {
    return choosen;
  }
  return null;
};

const createChoosenProduct = (golf: any, instance: VariantStore): any => {
  const choosen = verifyChoosenProduct(instance);
  if (choosen !== null) {
    const products = {
      product: golf._id,
      variant: choosen._id,
      quantity: 1,
    };
    const choosenProduct = {
      product: products,
    };
    return choosenProduct;
  }
  // replace this with warning message
  return null;
};

let instance = VariantStore.getInstance();
const Right: React.FC<IProps> = ({ data }) => {
  const [hands, setHands] = useState<Iterator>();
  const [lofts, setLofts] = useState<Iterator>();
  const [flexs, setFlexs] = useState<Iterator>();
  const [shafts, setShafts] = useState<Iterator>();
  const [render, setRender] = useState(false);
  const [choosenProduct, setChoosenProduct] = useState(null);
  const { token } = useContext(GlobalContext);

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
    property?.visualDisabled
      ? filterDisabled(property)
      : filterActive(property);

    // @ts-ignore
    instance.choosenVariant[propertyName] = property;
    setProperties();
  };

  // Only run whenever data changed to initialized states
  useEffect(() => {
    if (!data.variants) return;

    // Transform data and initialized states
    transformData(data.variants);
    // const instance = VariantStore.getInstance();
    const variants: Variant[] = instance.variants;
    setProperties();

    // Set the first selected property using filterActive
    const availableVariant: Variant | undefined = variants.find(
      (variant: Variant) => {
        return variant.stock > 0;
      }
    );

    if (availableVariant !== undefined) {
      // @ts-ignore
      filterActive(new Hand(availableVariant.hand));
    } else {
      filterActive(null);
    }
  }, [data]);

  const addToCart = async (choosenProduct: any) => {
    if (token) {
      await client.post("/api/carts/auth/add", choosenProduct, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      const { data } = await client.post("/api/carts/add", choosenProduct, {
        credentials: "include",
      });
      if (data.guestToken) {
        localStorage.setItem("guestToken", data.guestToken);
      }
    }
  };
  // useEffect(() => {
  //   if (choosenProduct !== null) {
  //     addToCart();
  //   }
  // }, [choosenProduct, token]);

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
          className={"add-to-cart-btn"}
          border="border"
          style={{
            marginTop: "1.3rem",
            padding: "1rem 0",
            width: "100%",
            fontWeight: "bold",
          }}
          disabled={!data.golf || !instance}
          onClick={() => {
            const choosen = createChoosenProduct(data.golf, instance);
            setChoosenProduct(choosen);
            addToCart(choosen);
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default Right;
