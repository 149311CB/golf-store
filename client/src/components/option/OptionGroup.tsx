import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface OptionGroupProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  name?: string;
  disableAutoSelect?: boolean;
  onChange?: Function;
}

export const OptionGroupContext = createContext<any>(null);

const OptionGroup: React.FC<OptionGroupProps> = ({
  children,
  style,
  name,
  disableAutoSelect = false,
  onChange,
}) => {
  const optionGroupRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<any>(null);
  const selectedValue = useRef(null);

  const removeActiveSibling = (e: MouseEvent) => {
    if (active === e.target) return;
    const activeChild = optionGroupRef.current?.querySelector(".option.active");
    activeChild?.classList.remove("active");
  };

  const runCallback = (value: any) => {
    if (selectedValue.current !== value) {
      selectedValue.current = value
      if (onChange) onChange(selectedValue.current);
    }
  };

  let value: any;

  value = {
    removeActiveSibling,
    setActive,
    runCallback
  };

  useEffect(() => {
    if (disableAutoSelect) {
      active?.classList.add("active");
      return;
    }
    const childArr = Array.from(
      optionGroupRef.current!.querySelectorAll(".option")
    );
    for (let i = 0; i < childArr.length; i++) {
      const child = childArr[i];
      if (!active) {
        if (
          !child.classList.contains("disabled") &&
          !child.classList.contains("v-disabled")
        ) {
          child.classList.add("active");
          setActive(child);
          break;
        }
      } else {
        // @ts-ignore
        if (active.classList.contains("v-disabled")) {
          setActive(null);
          return;
        }
        // @ts-ignore
        active.classList.add("active");
      }
    }
  }, [children, active, disableAutoSelect, onChange]);

  return (
    <OptionGroupContext.Provider value={value}>
      <div className={"option-group"} ref={optionGroupRef}>
        {/* @ts-ignore*/}
        {name && (
          <div className={"option-group-name"}>
            <strong>{`${name}: `}</strong>
            <span style={{ textOverflow: "clip" }}>
              {active && active!.textContent}
            </span>
          </div>
        )}
        <div style={style}>{children}</div>
      </div>
    </OptionGroupContext.Provider>
  );
};

export default OptionGroup;
