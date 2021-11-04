import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { Flex, Shaft } from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";
import { VariantStore } from "../../../hooks/useTransformData";

const instance = VariantStore.getInstance();
const Shafts: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
  groupStyle,
  optionStyle,
}) => {
  return (
    <OptionGroup
      disableAutoSelect={!(instance.choosenVariant.shaft !== null)}
      style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
      name={"Shaft"}
      onChange={(value: any) => {
        onPropertyChange(new Shaft(value));
      }}
    >
      {values &&
        values.mapValues((shaft: Shaft) => (
          <Option
            key={`${shaft._id}`}
            visualDisabled={shaft.disabled}
            value={shaft}
          >
            {shaft.name}
          </Option>
        ))}
    </OptionGroup>
  );
};

export default Shafts;
