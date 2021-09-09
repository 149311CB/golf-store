import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./OptionGroup.scss";
import { RemoveActiveContext } from "../../hooks/useRemoveActiveContext.js";

const groupDirection = {
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100%, 1fr))",
  },
  column: {
    display: "inline-flex",
    flexDirection: "row",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
};

const OptionGroup = ({ name, direction, children }) => {
  const [active, setActive] = useState();
  const optionListRef = useRef();
  const direct = direction ? direction : "column";

  const value = useMemo(
    () => ({
      active,
      setActive,
      optionListRef,
    }),
    [active, setActive, optionListRef]
  );

  // TODO: Turn this to a custom hook
  useLayoutEffect(() => {
    const firstChild = optionListRef.current.querySelector(".option");
    firstChild && firstChild.classList.add("active");
    firstChild && setActive(firstChild.textContent);
  }, []);

  return (
    <RemoveActiveContext.Provider value={value}>
      <div className={"option-group"}>
        {name && (
          <div className={"option-name"}>
            <strong>{name}:</strong> {active}
          </div>
        )}
        <div
          className={"option-list"}
          style={groupDirection[direct]}
          ref={optionListRef}
        >
          {children}
        </div>
      </div>
    </RemoveActiveContext.Provider>
  );
};

export { OptionGroup };
