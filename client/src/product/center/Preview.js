import React, { useCallback, useEffect } from "react";

const Preview = React.memo(({ images, setBigImage }) => {
  const changeActive = useCallback(
    (index) => {
      const previewList = document.querySelectorAll(`.neon`);
      previewList.forEach(function (item) {
        item.classList.remove("selected");
      });
      const preview = document.querySelector(`.neon-${index}`);
      preview && preview.classList.add("selected");
      setBigImage(index);
    },
    [setBigImage]
  );

  useEffect(() => {
    changeActive(0);
  }, [changeActive]);

  return (
    <div className={"preview-list"}>
      {images.map((i, index) => (
        <div
          key={index}
          className={`preview-container preview-container-${index}`}
          onClick={() => changeActive(index)}
        >
          <div className={`neon neon-${index}`} />
          <div className={`preview preview-${index}`}>
            <img src={i} alt="preview" />
          </div>
        </div>
      ))}
    </div>
  );
});

export default Preview;
