import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { Flex, IGolfProperty } from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";
import { VariantStore } from "../../../hooks/useTransformData";

const instance = VariantStore.getInstance();
const Flexes: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
  groupStyle,
  optionStyle
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
        values.map(
          (value: IGolfProperty) => (
            <Option
              key={`${value._id}`}
              visualDisabled={value.visualDisabled}
              disabled={value.disabled}
              style={optionStyle}
              value={value}
            >
              {(value as Flex).type}
            </Option>
          ),
          (a: any, b: any) => {
            return a.type.localeCompare(b.type)
          }
        )}
    </OptionGroup>
  );
};

export default Flexes;
