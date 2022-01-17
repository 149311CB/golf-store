import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { Shaft } from "../../../types/Golfs";
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
        values.mapValues(
          (value: Shaft) => (
            <Option
              key={`${value._id}`}
              visualDisabled={value.visualDisabled}
              disabled={value.disabled}
              value={value}
              style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}
            >
              <div
                style={{ width: "50px" }}
                className={"image-container box-shadow-small"}
              >
                <img src={value.image} alt="" style={{ width: "100%" }} />
              </div>
              <p style={{ marginBottom: "0.3rem" }}>{value.name}</p>
            </Option>
          ),
          (a: any, b: any) => {
            return a.name.localeCompare(b.name);
          }
        )}
    </OptionGroup>
  );
};

export default Shafts;
