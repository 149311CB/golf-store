import React, {CSSProperties, useContext, useEffect, useState} from "react";
import {transformData, VariantStore} from "../../hooks/useTransformData";
import {Hand, IGolfProperty, Variant} from "../../types/Golfs";
import {filterActive, filterDisabled} from "../../hooks/useFilterData";
import {Iterator, MapIterator} from "../../utils/iterator";
import Button from "../../components/button/Button";
import Hands from "./hands/Hands";
import Lofts from "./lofts/Lofts";
import Flexes from "./flexs/Flexes";
import Shafts from "./shafts/Shafts";
import {client} from "../../utils/client";
import {GlobalContext} from "../../App";
import GroupControls from "../../components/group-controls/GroupControls";
import Select from "../../components/select/Select";
import Snackbar from "../../components/snackbar/Snackbar";
import Alert from "../../components/alert/Alert";

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

const createChosenProduct = (
  golf: any,
  instance: VariantStore,
  qty: number
): any => {
  const choosen = verifyChoosenProduct(instance);
  if (choosen !== null) {
    const products = {
      product: golf._id,
      variant: choosen._id,
      quantity: qty,
    };
    return {
      product: products,
    };
  }
  // replace this with warning message
  return null;
};

let instance = VariantStore.getInstance();
const Right: React.FC<IProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [hands, setHands] = useState<Iterator>();
  const [lofts, setLofts] = useState<Iterator>();
  const [flexes, setFlexes] = useState<Iterator>();
  const [shafts, setShafts] = useState<Iterator>();
  const [render, setRender] = useState(false);
  const [chosenProduct, setChosenProduct] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [stock, setStock] = useState(0);
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const [toast, setToast] = useState(false);
  const { token, fetchCount } = useContext(GlobalContext);

  // manages states
  const setProperties = () => {
    const {
      hands: transformedHands,
      lofts: transformedLofts,
      flexes: transformedFlexes,
      shafts: transformedShafts,
    } = instance.transformedData;

    setHands(new MapIterator(transformedHands));
    setLofts(new MapIterator(transformedLofts));
    setFlexes(new MapIterator(transformedFlexes));
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
    const choosen = verifyChoosenProduct(instance);
    if (choosen) {
      setDisabled(false);
      setStock(choosen.stock);
    } else {
      setDisabled(true);
    }
    setProperties();
  };

  const addToCart = async (choosenProduct: any) => {
    let route = "/api/carts/add";
    if (token !== "-1") {
      route = "/api/carts/auth/add";
    }
    if (token) {
      try {
        const { status } = await client.post(route, choosenProduct, {
          credentials:"include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (status === 400) {
          setOpen(true);
        }
      } catch (error) {}
    }
  };


  // Only run whenever data changed to initialized states
  useEffect(() => {
    if (!data.variants) return;

    // Transform data and initialized states
    transformData(data.variants);
    const instance = VariantStore.getInstance();
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

  useEffect(() => {
    if (fetchCount) {
      fetchCount();
    }
  }, [fetchCount]);

  useEffect(() => {
    const list: number[] = [];
    for (let index = 0; index < stock; index++) {
      list.push(index);
    }
    setOptions(list);
  }, [stock]);

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
        <Flexes
          values={flexes}
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
        <GroupControls borderStyle={"round"} style={{ marginTop: "1.2rem" }}>
          <Select
            disabled={disabled}
            style={{ width: "25%" }}
            onChange={(e) => {
              setQty(parseInt(e.target.value));
            }}
          >
            {options.length <= 0 ? (
              <option>0</option>
            ) : (
              options.map((option) => (
                <option key={option}>{option + 1}</option>
              ))
            )}
          </Select>
          <Button
            className={"add-to-cart-badge-btn"}
            border="border"
            borderRadius="none"
            boxShadow="none"
            style={{
              padding: "1rem 0",
              width: "100%",
              fontWeight: "bold",
            }}
            disabled={disabled}
            onClick={() => {
              const chosen = createChosenProduct(data.golf, instance, qty);
              setChosenProduct(chosen);
              addToCart(chosen);
            }}
          >
            Add to cart
          </Button>
        </GroupControls>
        <Snackbar
          open={open}
          closeHandler={setOpen}
          borderRadius={"all"}
          boxShadow={"small"}
          timeout={3000}
        >
          <Alert type={"error"}>You can not add more of this item</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Right;
