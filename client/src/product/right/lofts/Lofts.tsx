import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { IGolfProperty, Loft } from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";
import { VariantStore } from "../../../hooks/useTransformData";

const instance = VariantStore.getInstance();
const Lofts: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
  groupStyle,
  optionStyle,
}) => {
  return (
    <OptionGroup
      disableAutoSelect={!(instance.choosenVariant.loft !== null)}
      style={groupStyle}
      name={"Loft"}
      onChange={(value: any) => {
        onPropertyChange(new Loft(value));
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
              {(value as Loft).type}
            </Option>
          ),
          (a: any, b: any) => {
            return a.type - b.type;
          }
        )}
    </OptionGroup>
  );
};

export default Lofts;
