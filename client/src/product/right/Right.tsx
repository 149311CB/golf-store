import React, { useState } from "react";
import { golfInterface } from "../../types";
import { Option, OptionGroup } from "black";

interface Props {
  golf: golfInterface;
}
const Right: React.FC<Props> = ({ golf }) => {
  const [hand, setHand] = useState(golf.hand ? golf.hand : "");
  const [loft, setLoft] = useState(golf.loft ? golf.loft[0] : {});
  const [flex, setFlex] = useState(golf.flex ? golf.flex[0] : {});
  const [shaft, setShaft] = useState(golf.shaft ? golf.shaft[0] : {});

  return (
    <div className={"right"}>
      <div className={"container"}>
        <OptionGroup name={"Hand"}>
          <Option optionalFunction={() => setHand("left")}>Left</Option>
          <Option optionalFunction={() => setHand("right")}>Right</Option>
        </OptionGroup>

        <OptionGroup name={"Loft"}>
          {golf.loft &&
            golf.loft.map((l, index) => (
              <Option key={`l-${index}`} optionalFunction={() => setLoft(l)}>
                {l}°
              </Option>
            ))}
        </OptionGroup>

        <OptionGroup name={"Flex"}>
          {golf.flex &&
            golf.flex.map((f, index) => (
              <Option key={`f-${index}`} optionalFunction={() => setFlex(f)}>
                {f}
              </Option>
            ))}
        </OptionGroup>

        <OptionGroup name={"Shaft"} direction={"row"}>
          {golf.shaft &&
            golf.shaft.map((s, index) => (
              <Option key={`s-${index}`} optionalFunction={() => setShaft(s)}>
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
                fontWeight: 700,
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
