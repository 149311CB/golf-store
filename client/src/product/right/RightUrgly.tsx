import React, { useEffect, useState } from "react";
import OptionGroup from "../../components/option/OptionGroup";
import Option from "../../components/option/Option";
import Button from "../../components/button/Button";

interface Props {
  data: any;
}

const Right: React.FC<Props> = ({ data }) => {
  const { golf, variants } = data;
  const [activeVariants, setActiveVariants] = useState<any[]>([]);

  const [identifier, setIdentifier] = useState("hand");

  const [flexs, setFlexs] = useState<any>([]);
  const [flex, setFlex] = useState();

  const [lofts, setLofts] = useState<any[]>([]);
  const [loft, setLoft] = useState<any[]>();

  const [hands, setHands] = useState<any[]>([]);
  const [hand, setHand] = useState<any>();

  const [shafts, setShafts] = useState<any[]>([]);
  const [shaft, setShaft] = useState<any>();

  const inlineOptions = {
    display: "inline-flex",
    gap: "0.6rem",
  };

  const optionGroup = {
    marginBottom: "0.6rem",
  };

  const checkIfExits = (value: any, arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (value._id === arr[i]._id) {
        return true;
      }
    }
    return false;
  };

  const checkIfHandExits = (value: any, arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (value === arr[i].side) {
        return true;
      }
    }
    return false;
  };

  const invertDisabled = (value: any, arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (value._id === arr[i]._id) {
        arr[i].disabled = false;
        break;
      }
    }
  };

  useEffect(() => {
    if (identifier !== "hand") return;
    if (hands.length === 0) return;
    const activeVariantArr: any = [];
    variants.forEach((variant: any) => {
      if (variant.hand === hand) {
        activeVariantArr.push(variant._id);
      }
    });
    setActiveVariants(activeVariantArr);
  }, [hand, identifier]);

  useEffect(() => {
    if (identifier !== "flex") return;
    if (flexs.length === 0) return;
    const activeVariantArr: any = [];
    variants.forEach((variant: any) => {
      if (variant.flex._id === flex) {
        activeVariantArr.push(variant._id);
      }
    });
    setActiveVariants(activeVariantArr);
  }, [flex, identifier]);

  useEffect(() => {
    if (identifier !== "loft") return;
    if (lofts.length === 0) return;
    const activeVariantArr: any = [];
    variants.forEach((variant: any) => {
      if (variant.loft._id === loft) {
        activeVariantArr.push(variant._id);
      }
    });
    setActiveVariants(activeVariantArr);
  }, [loft, identifier]);

  useEffect(() => {
    if (identifier !== "shaft") return;
    if (shafts.length === 0) return;
    const activeVariantArr: any = [];
    variants.forEach((variant: any) => {
      if (variant.shaft._id === shaft) {
        activeVariantArr.push(variant._id);
      }
    });
    console.log(activeVariants);
    setActiveVariants(activeVariantArr);
  }, [shaft, identifier]);

  useEffect(() => {
    const flexsSet: any[] = [];
    const loftsSet: any[] = [];
    const shaftsSet: any[] = [];
    const handsSet: any[] = [];
    if (activeVariants.length === 0) return;
    variants.forEach((variant: any) => {
      if (!checkIfHandExits(variant.hand, handsSet)) {
        if (activeVariants.includes(variant._id)) {
          handsSet.push({ side: variant.hand, disabled: false });
        } else {
          handsSet.push({ side: variant.hand, disabled: true });
        }
      }

      if (!checkIfExits(variant.flex, flexsSet)) {
        if (activeVariants.includes(variant._id)) {
          flexsSet.push({ ...variant.flex, disabled: false });
        } else {
          flexsSet.push({ ...variant.flex, disabled: true });
        }
      } else if (activeVariants.includes(variant._id)) {
        invertDisabled(variant.flex, flexsSet);
      }
      if (!checkIfExits(variant.loft, loftsSet)) {
        if (activeVariants.includes(variant._id)) {
          loftsSet.push({ ...variant.loft, disabled: false });
        } else {
          loftsSet.push({ ...variant.loft, disabled: true });
        }
      } else if (activeVariants.includes(variant._id)) {
        invertDisabled(variant.loft, loftsSet);
      }
      if (!checkIfExits(variant.shaft, shaftsSet)) {
        if (activeVariants.includes(variant._id)) {
          shaftsSet.push({ ...variant.shaft, disabled: false });
        } else {
          shaftsSet.push({ ...variant.shaft, disabled: true });
        }
      } else if (activeVariants.includes(variant._id)) {
        invertDisabled(variant.shaft, shaftsSet);
      }
    });

    setFlexs(flexsSet);
    setLofts(loftsSet);
    setShafts(shaftsSet);
    setHands(
      handsSet.sort((a, b) => {
        return b.side < a.side ? -1 : 1;
      })
    );
  }, [activeVariants]);

  // Run on the first render
  useEffect(() => {
    const flexsSet: any[] = [];
    const loftsSet: any[] = [];
    const handsSet: any[] = [];
    const shaftsSet: any[] = [];

    variants.forEach((variant: any) => {
      if (!checkIfExits(variant.flex, flexsSet)) {
        flexsSet.push({ ...variant.flex, disabled: false });
      }
      if (!checkIfExits(variant.loft, loftsSet)) {
        // if (variant.flex._id === flex) {
        loftsSet.push({ ...variant.loft, disabled: false });
        // } else {
        // loftsSet.push({ ...variant.loft, disabled: true });
        // }
      }
      shaftsSet.push({ ...variant.shaft, disabled: false });
    });
    handsSet.push({ side: "right", disabled: false });
    handsSet.push({ side: "left", disabled: false });
    setFlexs(flexsSet);
    setLofts(loftsSet);
    setShafts(shaftsSet);
    setHands(handsSet);
    setHand("right");
  }, []);

  return (
    <div className={"right"}>
      <div className={"container"}>
        <OptionGroup style={{ ...inlineOptions, ...optionGroup }} name={"Hand"}>
          {hands.map((hand: any) => (
            <Option
              visualDisabled={hand.disabled}
              onClick={() => {
                setIdentifier("hand");
                setHand(hand.side);
              }}
            >
              {hand.side}
            </Option>
          ))}
        </OptionGroup>
        <OptionGroup
          disableAutoSelect
          style={{ ...inlineOptions, ...optionGroup }}
          name={"Loft"}
        >
          {lofts.map((loft: any) => (
            <Option
              visualDisabled={loft.disabled}
              onClick={() => {
                setLoft(loft._id);
                setIdentifier("loft");
              }}
            >
              {loft.type}
            </Option>
          ))}
        </OptionGroup>
        <OptionGroup
          disableAutoSelect
          style={{ ...inlineOptions, ...optionGroup }}
          name={"Flex"}
        >
          {flexs.map((flex: any) => (
            <Option
              visualDisabled={flex.disabled}
              onClick={() => {
                setFlex(flex._id);
                setIdentifier("flex");
              }}
            >
              {flex.type}
            </Option>
          ))}
        </OptionGroup>
        <OptionGroup
          disableAutoSelect
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            ...optionGroup,
          }}
          name={"Shaft"}
        >
          {shafts.map((shaft: any) => (
            <Option
              visualDisabled={shaft.disabled}
              onClick={() => {
                setShaft(shaft._id);
                setIdentifier("shaft");
              }}
              style={inlineOptions}
            >
              <div className={"image-container"}>
                <img src={shaft.image} alt={`shaft-img-${shaft._id}`} />
              </div>
              {shaft.name}
            </Option>
          ))}
        </OptionGroup>
        <Button
          style={{
            width: "100%",
            padding: "1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          BUY NOW
        </Button>
      </div>
    </div>
  );
};

export default Right;
