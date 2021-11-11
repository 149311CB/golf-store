import React from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { Hand} from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";

const Hands: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
  groupStyle,
  optionStyle,
}) => {
  return (
    <OptionGroup
      style={groupStyle}
      name={"Hand"}
      onChange={(value: any) => {
        onPropertyChange(new Hand(value));
      }}
    >
      {values &&
        values.mapValues((value: Hand) => (
          <Option
            key={`${value._id}`}
            visualDisabled={value.visualDisabled}
            disabled={value.disabled}
            style={optionStyle}
            value={value}
          >
            {value.side}
          </Option>
        ))}
    </OptionGroup>
  );
};

export default Hands;
