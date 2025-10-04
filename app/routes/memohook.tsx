import { memo, useCallback, useMemo, useState, useId } from "react";
import useCounterStore from "~/stores/useCounter";

const MemoHook = () => {
  // const [count, setCount] = useState(0);
  const counter = useCounterStore() as { increment: () => void; count: number };

  // console.log("count ", count);
  const id = useId();
  const item1 = useMemo(() => ({ id: 1, name: "Item 1" }), []);
  const item2 = useMemo(() => ({ id: 2, name: "Item 2" }), []);

  const handleClick = useCallback(() => {
    counter.increment();
  }, [counter.increment]);

  return (
    <div>
      <h1>Memo Hook</h1>
      <p>ID: {id}</p>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={handleClick}
      >
        Count: {counter.count}
      </button>
      <Item item={item1} handleClick={handleClick} />
      <Item item={item2} handleClick={handleClick} />
    </div>
  );
};

const Item = memo(
  ({ item, handleClick }: { item: any; handleClick: () => void }) => {
    console.log("item ", item);
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
