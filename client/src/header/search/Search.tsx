import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const Search = () => {
  const searchNode = useOnClickOutside();

  const toggleSearchBox = () => {
    searchNode.current.classList.add("expand");
  };

  return (
    <div className={"search "} ref={searchNode}>
      <input type="text" name="search-input" />
      <button className={"search-btn pop"} onClick={toggleSearchBox}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default Search;
