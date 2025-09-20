import {
  useCallback,
  useState,
  memo,
  createContext,
  useMemo,
  useContext,
  useId,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useTransition,
} from "react";
import useList from "../hooks/useList";
import useScroll from "../hooks/useScroll";

const UserContext = createContext({});
const UserStateContext = createContext({});
const UserDispatchContext = createContext({});

const List = () => {
  const [count, setCount] = useState(0);
  const { itemsRef, scrollToItem } = useScroll();
  const { query, filtered, isPending, handleChange } = useList(
    "https://dummyjson.com/products?limit=200"
  );

  return (
    <>
      <ButtonTurning />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={() => scrollToItem(10)}>Scroll to Item 10</button>
      <Counter value={count} />

      <input
        className="border-2 border-gray-300 rounded-md p-2"
        onChange={handleChange}
        value={query}
      />

      {/* <button onClick={() => {  console.log('inputRef.current ', inputRef.current); }}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
      <Animation /> */}
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
    </>
  );
};

export default List;

const MainPage = memo(() => {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
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
    console.log("changeColor ");
    if (redButtonRef.current) {
      redButtonRef.current.style.color = "red";
    }
  };
  const triggerRedButton = () => {
    console.log("redButtonRef.current ", redButtonRef.current);
    if (redButtonRef.current) {
      // Method 1: Try mouseover instead of mouseenter
      // mouseover bubbles and might be caught by React's delegation
      // const mouseoverEvent = new MouseEvent("mouseover", {
      //   bubbles: true,
      //   cancelable: true,
      //   view: window,
      //   clientX: 0,
      //   clientY: 0,
      // });
      
      // console.log("Dispatching mouseover event");
      // const dispatched = redButtonRef.current.dispatchEvent(mouseoverEvent);
      // console.log("Mouseover event dispatched:", dispatched);
      
      // // Method 2: Try mouseenter with different approach
      // const mouseenterEvent = new MouseEvent("mouseenter", {
      //   bubbles: true,
      //   cancelable: true,
      //   view: window,
      //   clientX: 0,
      //   clientY: 0,
      // });
      
      // console.log("Dispatching mouseenter event");
      // const dispatched2 = redButtonRef.current.dispatchEvent(mouseenterEvent);
      // console.log("Mouseenter event dispatched:", dispatched2);
      
      // // Method 3: Force trigger by simulating mouse movement
      // // Create a mouseout event first, then mouseenter
      // const mouseoutEvent = new MouseEvent("mouseout", {
      //   bubbles: true,
      //   cancelable: true,
      //   view: window,
      // });
      
      // redButtonRef.current.dispatchEvent(mouseoutEvent);
      
      // Small delay then mouseenter
      setTimeout(() => {
        const delayedMouseenter = new MouseEvent("mouseenter", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 0,
          clientY: 0,
        });
        redButtonRef.current?.dispatchEvent(delayedMouseenter);
      }, 100);
    }
  };
  return (
    <>
      <button className="bg-purple-500" onClick={triggerRedButton}>
        Trigger Red Button
      </button>
      <button
        ref={redButtonRef}
        className="bg-green-500"
        onClick={changeColor}
        onMouseEnter={changeColor}
      >
        Red Button
      </button>
    </>
  );
}

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

const CustomInput = forwardRef((props, ref) => {
  // const inputRef = useRef<HTMLInputElement>(null);

  // useImperativeHandle(ref, () => ({
  //     focus: () => inputRef.current?.focus(),
  //     clear: () => (inputRef.current!.value = ""),
  // }));
  return (
    <input
      className="border-2 border-gray-300 rounded-md p-2"
      ref={ref as Ref<HTMLInputElement>}
      {...props}
    />
  );
});
