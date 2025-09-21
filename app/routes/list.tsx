import {
  useState,
  memo,
  createContext,
  useContext,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import useList from "../hooks/useList";
import useScroll from "../hooks/useScroll";

const UserContext = createContext({});
const UserStateContext = createContext({});
const UserDispatchContext = createContext({});

// List page
const List = () => {
  const [count, setCount] = useState(0);
  const { itemsRef, scrollToItem } = useScroll();
  const inputRef = useRef<{ focus: () => void; clear: () => void }>(null);
  const { query, filtered, isPending, handleChange } = useList(
    "https://dummyjson.com/products?limit=200"
  );

  return (
    <>
      <ButtonTurning />
      <Animation />
      <div className="flex flex-col gap-2 mt-50 items-center">
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        <button onClick={() => scrollToItem(10)}>Scroll to Item 10</button>
        <Counter value={count} />
        
        <CustomInput ref={inputRef} />
        <button
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          Focus
        </button>
        <button onClick={() => inputRef.current?.clear()}>Clear</button>
        <input
          className="border-2 border-gray-300 rounded-md p-2 w-1/4"
          onChange={handleChange}
          value={query}
        />
        {isPending && <div>Loading...</div>}
        {filtered.map((item: any, index: number) => (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                itemsRef.current[index] = el;
              }
            }}
          >
            <p>{item.title}</p>
            <img className="w-50 h-50" src={item.images[0]} alt={item.title} />
          </div>
        ))}
      </div>
    </>
  );
};

export default List;

// Context
const MainPage = memo(() => {
  const [user, setUser] = useState({ name: "John" });
  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider
        value={{
          setUser,
        }}
      >
        <Header />
        <Sidebar />
        <Content />
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
});

const Header = memo(() => {
  console.log("Header rendered");
  const user = useContext(UserStateContext);
  return <div>Header {user?.name}</div>;
});

const Sidebar = memo(() => {
  console.log("Sidebar rendered");
  return <div>Sidebar</div>;
});

const Content = memo(() => {
  console.log("Content rendered");
  return <div>Content</div>;
});

function ButtonTurning() {
  const redButtonRef = useRef<HTMLButtonElement | null>(null);
  const changeColor = () => {
    if (redButtonRef.current) {
      redButtonRef.current.style.color = "red";
    }
  };
  const triggerRedButton = () => {
    console.log("redButtonRef.current ", redButtonRef.current);
    if (redButtonRef.current) {
      const delayedMouseover = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: 0,
        clientY: 0,
      });
      redButtonRef.current?.dispatchEvent(delayedMouseover);
    }
  };
  return (
    <div className="mt-4 mb-2">
      <button
        className="bg-purple-500 p-2 rounded-md"
        onClick={triggerRedButton}
      >
        Trigger Red Button
      </button>
      <button
        ref={redButtonRef}
        className="bg-green-500 p-2 rounded-md"
        onClick={changeColor}
        onMouseEnter={changeColor}
      >
        Red Button
      </button>
    </div>
  );
}

// Ref reserve previous value
function Counter({ value }: { value: number }) {
  const prevValue = useRef<number | null>(null);

  useEffect(() => {
    prevValue.current = value;
    console.log("prevValue.current ", prevValue.current);
  }, [value]);

  return (
    <p>
      Now: {value}, before: {prevValue.current}
    </p>
  );
}

// Animation with ref
function Animation() {
  const frameRef = useRef<number | null>(null);
  const [position, setPosition] = useState(0);
  const lastTimeRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (time: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }
      const timeElapsed = time - startTimeRef.current;

      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current;
        setPosition((prev) => prev + delta * 0.1);
      }
      lastTimeRef.current = time;

      if (timeElapsed < 2000) {
        frameRef.current = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(frameRef.current!);
      }
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current!);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "red",
        width: "100px",
        height: "100px",
        position: "absolute",
        left: position,
        top: 100,
      }}
    ></div>
  );
}

// useImperativeHandle
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => (inputRef.current!.value = ""),
  }));
  return (
    <input
      className="border-2 border-gray-300 rounded-md p-2 w-1/4"
      ref={inputRef}
      {...props}
    />
  );
});
