import React, { useContext, useRef } from "react";
import { RemoveActiveContext } from "../../hooks/RemoveActiveContext";

const Option = ({ children, optionalFuntion }) => {
  const { optionListRef, setActive, removeActive } =
    useContext(RemoveActiveContext);

  const optionRef = useRef();

  const defaultOnClick = (e) => {
    removeActive();
    setActive(e.target.textContent);
    optionRef.current.classList.add("active");
    typeof optionalFuntion != "undefined" && optionalFuntion();
  };

  const backgroundAnimated = (e) => {
    if (e.target !== optionRef.current) e.target.background = "transparent";
    const rect = e.target.getBoundingClientRect();
    const containerRect = optionListRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top; //y position within the element.
    optionListRef.current.style.background = `radial-gradient(${
      e.target.offsetWidth
    }px 

    ${e.target.offsetHeight}px 
    at ${e.clientX - containerRect.left}px ${e.clientY - containerRect.top}px , 
    rgba(255,255,255,0.5), rgba(255,255,255,0))`;

    if (optionRef.current.classList.contains("active")) {
      optionRef.current.style.background = `radial-gradient(${
        optionRef.current.offsetWidth
      }px 
        ${
          optionRef.current.offsetHeight * 2
        }px at ${x}px ${y}px ,rgba(255,255,255,0.4), rgba(255,255,255,0))`;
      return;
    }
    optionRef.current.style.background = `radial-gradient(${
      optionRef.current.offsetWidth
    }px 
      ${
        optionRef.current.offsetHeight * 2
      }px at ${x}px ${y}px ,rgba(255,255,255,0.2), rgba(255,255,255,0))`;
  };

  const removeBackground = (e) => {
    optionListRef.current.style.background = "black";
    if (!optionRef.current.classList.contains("active")) {
      optionRef.current.style.background = "black";
    } else optionRef.current.style.background = "";
  };

  return (
    <div className={"option-container"}>
      <div
        ref={optionRef}
        className={"option"}
        onClick={defaultOnClick}
        onMouseMove={backgroundAnimated}
        onMouseLeave={removeBackground}
      >
        {children}
      </div>
    </div>
  );
};

export default Option;
