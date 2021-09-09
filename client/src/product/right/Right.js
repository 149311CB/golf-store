import React, { useState } from "react";
import { Option, OptionGroup } from "@149311cb/black";

const Right = ({ golf }) => {
  const [hand, setHand] = useState(golf.hand ? golf.hand : []);
  const [loft, setLoft] = useState(golf.loft ? golf.loft : []);
  const [flex, setFlex] = useState(golf.flex ? golf.flex : []);
  const [shaft, setShaft] = useState(golf.shaft ? golf.shaft : []);

  return (
    <div className={"right"}>
      <div className={"container"}>
        <OptionGroup name={"Hand"}>
          <Option optionalFuntion={() => setHand("left")}>Left</Option>
          <Option optionalFuntion={() => setHand("right")}>Right</Option>
        </OptionGroup>

        <OptionGroup name={"Loft"}>
          {golf.loft.map((l, index) => (
            <Option key={`l-${index}`} optionalFuntion={() => setLoft(l)}>
              {l}°
            </Option>
          ))}
        </OptionGroup>

        <OptionGroup name={"Flex"}>
          {golf.flex.map((f, index) => (
            <Option key={`f-${index}`} optionalFuntion={() => setFlex(f)}>
              {f}
            </Option>
          ))}
        </OptionGroup>

        <OptionGroup name={"Shaft"} direction={"row"}>
          {golf.shaft.map((s, index) => (
            <Option key={`s-${index}`} optionalFuntion={() => setShaft(s)}>
              <div className={"shaft"}>
                <div className={"image-container"}>
                  <img src={s.image} alt={"shaft"} />
                </div>
                <div className={"name"}>{s.name}</div>
              </div>
            </Option>
          ))}
        </OptionGroup>
        <OptionGroup direction={"row"}>
          <Option>
            <div
              style={{
                textAlign: "center",
                padding: "0.3rem 0",
                fontWeight: "700",
              }}
            >
              BUY NOW
            </div>
          </Option>
        </OptionGroup>
      </div>
    </div>
  );
};

export default Right;
