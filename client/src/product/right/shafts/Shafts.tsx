import React, { useRef, useState } from "react";
import OptionGroup from "../../../components/option/OptionGroup";
import Option from "../../../components/option/Option";
import { IGolfProperty, Shaft } from "../../../types/Golfs";
import { IGolfComponentsProps } from "../Right";
import { VariantStore } from "../../../hooks/useTransformData";

const fade = [
  {
    opacity: 0,
  },
  {
    opacity: 0.25,
  },
  {
    opacity: 0.5,
  },
]

export function animateTo(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  const anim = element.animate(keyframes, { ...options, fill: "both" });
  anim.addEventListener("finish", () => {
    anim.commitStyles();
    anim.cancel();
  })

  return anim;
}

const ShaftOption: React.FC<{ value: Shaft }> = ({ value }) => {
  return (<Option
    className={"shaft-option"}
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
      <img src={(value as Shaft).image} alt="" style={{ width: "100%" }} />
    </div>
    <p style={{ marginBottom: "0.3rem" }}>{(value as Shaft).name}</p>
  </Option>)
}

const instance = VariantStore.getInstance();
const Shafts: React.FC<IGolfComponentsProps> = ({
  values,
  onPropertyChange,
}) => {
  const chevronRef = useRef<SVGSVGElement>(null)
  const chevronLeft = useRef<SVGSVGElement>(null)
  const [index, setIndex] = useState(0);
  const colNum = Math.ceil((values?.length || 1) / 2)
  const onChevronClick = (direction: "left" | "right") => {
    if (direction === "right") {
      const offset = document.querySelector(".shaft-group")?.clientWidth || 0
      const elements = Array.from(document.querySelectorAll(".shaft-option"));
      const animateOptions: KeyframeAnimationOptions = { fill: "forwards", easing: "ease-in-out", duration: 150 }
      elements.forEach((elemnt: Element) => {
        animateTo(elemnt, [{ transform: `translateX(-${offset * (index + 1) + 33}px)` }], animateOptions)
      })
      setIndex(index + 1);
    } else if (direction === "left") {
      const elementWidth = document.querySelector(".shaft-group")?.clientWidth || 0
      const elements = Array.from(document.querySelectorAll(".shaft-option"));
      const animateOptions: KeyframeAnimationOptions = { fill: "forwards", easing: "ease-in-out", duration: 150 }
      elements.forEach((elemnt: Element) => {
        let offset = elementWidth * (index - 1)
        if (offset > 1) {
          offset += 33
        }
        animateTo(elemnt, [{ transform: `translateX(-${offset}px)` }], animateOptions)
      })
      setIndex(index - 1);
    }
  }

  return (
    <div style={{
      position: "relative",
    }}>
      <OptionGroup
        className={"shaft-group"}
        disableAutoSelect={!(instance.choosenVariant.shaft !== null)}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.ceil((values?.length || 1) / 2)}, 100%)`,
          columnGap: "3.0rem",
          rowGap: "0.9rem",
          position: "relative",
          animation: "1s ease-in-out forwards 500ms",
          overflow: "hidden",
          padding: "0.6rem"
        }}
        name={"Shaft"}
        onChange={(value: any) => {
          onPropertyChange(new Shaft(value), "shaft");
        }}
        onMouseEnter={() => {
          if (chevronRef.current) {
            animateTo(chevronRef.current, fade, { duration: 250, easing: "ease-in-out" })
          }
          if (chevronLeft.current) {
            animateTo(chevronLeft.current, fade, { duration: 250, easing: "ease-in-out" })
          }
        }}
        onMouseLeave={() => {
          if (chevronRef.current) {
            animateTo(chevronRef.current, fade, { duration: 250, easing: "ease-in-out", direction: "reverse" })
          }
          if (chevronLeft.current) {
            animateTo(chevronLeft.current, fade, { duration: 250, easing: "ease-in-out", direction: "reverse" })
          }
        }}
      >
        {values &&
          values.map(
            (value: IGolfProperty) => (
              <ShaftOption value={value as Shaft} key={value._id} />
            ))}
      </OptionGroup>
      {
        index >= 1 &&
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"
          className={"shaft-chevron"}
          style={{
            position: "absolute",
            transform: `translate(50%, -50%)`,
            top: "55%",
            width: "50px", height: "50px",
            left: "-50px",
            cursor: "pointer",
          }}
          ref={chevronLeft}
          onMouseEnter={() => {
            if (chevronLeft.current) {
              animateTo(chevronLeft.current, [{ opacity: 0.5 }, { opacity: 1 }], { duration: 250, easing: "ease-in-out" })
            }
          }}
          onMouseLeave={() => {
            if (chevronLeft.current) {
              animateTo(chevronLeft.current, [{ opacity: 1 }, { opacity: 0.5 }], { duration: 250, easing: "ease-in-out" })
            }
          }}
          onClick={() => { onChevronClick("left") }}

        >
          <path d="M7 1L1 7L7 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      {colNum >= 2 && index < colNum - 1 &&
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" className={"shaft-chevron"}
          style={{
            position: "absolute",
            transform: `translate(50%, -50%)`,
            top: "55%",
            width: "50px", height: "50px",
            right: "0",
            cursor: "pointer",
          }}
          ref={chevronRef}
          onMouseEnter={() => {
            if (chevronRef.current) {
              animateTo(chevronRef.current, [{ opacity: 0.5 }, { opacity: 1 }], { duration: 250, easing: "ease-in-out" })
            }
          }}
          onMouseLeave={() => {
            if (chevronRef.current) {
              animateTo(chevronRef.current, [{ opacity: 1 }, { opacity: 0.5 }], { duration: 250, easing: "ease-in-out" })
            }
          }}
          onClick={() => { onChevronClick("right") }}
        >
          <path fill="none" fillRule="evenodd" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 12l6-6-6-6" transform="translate(1 1)" />
        </svg>}
    </div>
  );
};

export default Shafts;
