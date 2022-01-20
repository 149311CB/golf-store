import React, { useRef } from "react";
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

function animateTo(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  const anim = element.animate(keyframes, { ...options, fill: "both" });
  anim.addEventListener("finish", () => {
    anim.commitStyles();
    anim.cancel();
  })

  return anim;
}

const ShaftOption: React.FC<{ value: Shaft }> = ({ value }) => {
  return (<Option
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
  return (
    <OptionGroup
      disableAutoSelect={!(instance.choosenVariant.shaft !== null)}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 100%)",
        columnGap: "3.0rem",
        rowGap: "0.9rem",
        position: "relative"
      }}
      name={"Shaft"}
      onChange={(value: any) => {
        onPropertyChange(new Shaft(value));
      }}
      onMouseEnter={() => {
        if (chevronRef.current) {
          animateTo(chevronRef.current, fade, { duration: 250, easing: "ease-in-out" })
        }
      }}
      onMouseLeave={() => {
        if (chevronRef.current) {
          animateTo(chevronRef.current, fade, { duration: 250, easing: "ease-in-out", direction: "reverse" })
        }
      }}
    >
      {values &&
        values.map(
          (value: IGolfProperty) => (
            <ShaftOption value={value as Shaft} />
          ))}
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" className={"shaft-chevron-right"}
        style={{
          position: "absolute",
          transform: `translate(50%, -50%)`,
          top: "50%",
          width: "50px", height: "50px",
          right: "0",
          cursor: "pointer"
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
      >
        <path fill="none" fillRule="evenodd" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 12l6-6-6-6" transform="translate(1 1)" />
      </svg>
    </OptionGroup>
  );
};

export default Shafts;
