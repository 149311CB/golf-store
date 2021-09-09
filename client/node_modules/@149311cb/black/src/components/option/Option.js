import React, { useContext, useRef } from "react";
import "./Option.scss";
import { RemoveActiveContext } from "../../hooks/useRemoveActiveContext";
import {
  animateBackground,
  resetBackground,
  defaultOnClick,
} from "../../hooks/useCreateOption";

const Option = ({ children, optionalFunction }) => {
  const context = useContext(RemoveActiveContext);

  if (!context) {
    throw Error("Option component need to be wrapped in an OptionGroup");
  }

  const { setActive, optionListRef } = context;

  const optionRef = useRef();

  return (
    <div className={"option-container"}>
      <div
        className={"option"}
        ref={optionRef}
        onClick={() =>
          defaultOnClick(
            setActive,
            optionalFunction,
            optionRef.current,
            optionListRef.current
          )
        }
        onMouseMove={(e) =>
          animateBackground(e, optionRef.current, optionListRef.current)
        }
        onMouseLeave={() =>
          resetBackground(optionRef.current, optionListRef.current)
        }
      >
        {children}
      </div>
    </div>
  );
};

export  {Option};
