// Get elemtn bounding client rectangle
const getElementRect = (element) => {
  const rect = element.getBoundingClientRect();
  return rect;
};

// Animate element and parent elemnt background
// TODO: Split parent animated with element animated so they can be use seperately
export const animateBackground = (event, element, parentElement) => {
  // Prent child element of option component have it own animateBackground event
  if (event.target != element.current) event.target.background = "transparent";

  // Get element's bounding client rect
  const { top, left } = getElementRect(element);
  // Get parent element's bounding client rect
  const { top: parentTop, left: parentLeft } = getElementRect(parentElement);

  const x = event.clientX - left;
  const y = event.clientY - top;

  // Animate parent background following cusor position of hovering element
  parentElement.style.background = `radial-gradient(${element.offsetWidth}px
    ${element.offsetHeight}px
    at ${event.clientX - parentLeft}px ${event.clientY - parentTop}px ,
    rgba(255,255,255,0.5), rgba(255,255,255,0))`;

  // A difference color for currently active option
  if (element.classList.contains("active")) {
    element.style.background = `radial-gradient(${element.offsetWidth}px 
        ${
          element.offsetHeight * 2
        }px at ${x}px ${y}px ,rgba(255,255,255,0.4), rgba(255,255,255,0))`;
    return;
  }

  // Animate element background following cusor position inside it
  element.style.background = `radial-gradient(${element.offsetWidth}px
      ${
        element.offsetHeight * 2
      }px at ${x}px ${y}px ,rgba(255,255,255,0.2), rgba(255,255,255,0))`;
};

const removeActiveSibling = (parentElement) => {
  const currentActive = parentElement.querySelector(".option.active");
  currentActive.classList.remove("active");
};
// Default onClick handler
// TODO: Find a way to refractor these function outside defaultOnClick
export const defaultOnClick = (
  setActive,
  optionalFunction,
  element,
  parentElement
) => {
  removeActiveSibling(parentElement);
  setActive(element.textContent);
  element.classList.add("active");
  Boolean(optionalFunction) && optionalFunction();
};

// Reset background on leave
// TODO: Split element and parent function
export const resetBackground = (element, parentElement) => {
  parentElement.style.background = "black";

  if (!element.classList.contains("active")) {
    element.style.background = "black";
  } else element.style.background = "";
};
