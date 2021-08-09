import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { RemoveActiveContext } from "../../hooks/RemoveActiveContext";

const groupDirection = {
  row: {
    display: "flex",
    flexDirection: "column",
  },
  column: {
    display: "inline-flex",
  },
};

const OptionGroup = ({ name, direction, children }) => {
  const [active, setActive] = useState();
  const direct = direction ? direction : "column";
  const optionListRef = useRef();

  const removeActive = () => {
    const currentActive = optionListRef.current.querySelector(".option.active");
    currentActive.classList.remove("active");
  };

  const value = useMemo(
    () => ({
      active,
      setActive,
      removeActive,
      optionListRef,
    }),
    [active, setActive]
  );

  useLayoutEffect(() => {
    const firstChild = optionListRef.current.querySelector(".option");
    firstChild && firstChild.classList.add("active");
    firstChild && setActive(firstChild.textContent);
  }, []);

  return (
    <>
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
    </>
  );
};

export default OptionGroup;
