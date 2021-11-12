import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { Flex } from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";
import { VariantStore } from "../../../hooks/useTransformData";

const instance = VariantStore.getInstance();
const FLexs: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
  groupStyle,
  optionStyle,
}) => {
  return (
    <OptionGroup
      disableAutoSelect={!(instance.choosenVariant.flex !== null)}
      style={groupStyle}
      name={"Flex"}
      onChange={(value: any) => {
        onPropertyChange(new Flex(value));
      }}
    >
      {values &&
        values.mapValues(
          (value: Flex) => (
            <Option
              key={`${value._id}`}
              visualDisabled={value.visualDisabled}
              disabled={value.disabled}
              style={optionStyle}
              value={value}
            >
              {value.type}
            </Option>
          ),
          (a: any, b: any) => {
            return a.type.localeCompare(b.type)
          }
        )}
    </OptionGroup>
  );
};

export default FLexs;
