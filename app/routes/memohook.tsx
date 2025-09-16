import { memo, useCallback, useMemo, useState, useId } from "react";

const MemoHook = () => {
  const [count, setCount] = useState(0);
  const id = useId();
  console.log("id -- ", id);
  const item1 = useMemo(() => ({ id: 1, name: "Item 1" }), []);
  const item2 = useMemo(() => ({ id: 2, name: "Item 2" }), []);

  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <div>
      <h1>Memo Hook</h1>
      <p>ID: {id}</p>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={handleClick}
      >
        Count: {count}
      </button>
      <Item item={item1} handleClick={handleClick} />
      <Item item={item2} handleClick={handleClick} />
    </div>
  );
};

const Item = memo(
  ({ item, handleClick }: { item: any; handleClick: () => void }) => {
    return (
      <div>
        <h1>Item</h1>
        <p>Item ID: {item.id}</p>
        <p>Item Name: {item.name}</p>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={handleClick}
        >
          Click me
        </button>
      </div>
    );
  }
);

export default MemoHook;
