import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useInsertionEffect,
  createElement,
  useReducer,
  useMemo,
  memo,
  useCallback,
  useContext,
  createContext,
} from "react";

const CounterContext = createContext({ count: 0, setCount: (count: number) => {} });

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload, text: "increment" };
    case "decrement":
      return { count: state.count - 1, text: "decrement" };
  }
};

function compute() {
  const max = 1000000000;
  let i = 0;
  while (i < max) {
    i++;
  }
  return i;
}
const HookTest = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, text: "initial" });
  const [count, setCount] = useState(0);
  const handelClict = useCallback(() => {
    setCount((prevState) => prevState + 1);
  }, []);
  //   const value = useMemo(() => compute(), []);
  const obj = useMemo(() => ({ a: 1 }), []);
  return (
    <>
      <p>{count}</p>
      <button onClick={handelClict}>Increment</button>
      <CounterContext.Provider value={{ count, setCount }}>
        <ChildMemo obj={{ a: 1 }} />
      </CounterContext.Provider>
      <BoxLayout2 />
      {/* <BlueButton className="red">Blue Button</BlueButton> */}
    </>
  );
};

const Child = ({ obj }: { obj: any }) => {
  // shallow compare
  const { count } = useContext(CounterContext);
  console.log("Child rendered");
  return <div>Child {obj.a} {count}</div>;
};

function areEqual(prevProps: any, nextProps: any) {
  return prevProps.obj.a === nextProps.obj.a;
}
const ChildMemo = memo(Child, areEqual); // true
function styled(tag: string, styles: any) {
  return function StyledComponent(props: any) {
    const className = "sc-" + Object.keys(styles).join("-");
    console.log("className", className);

    useInsertionEffect(() => {
      const styleEl = document.createElement("style");
      styleEl.setAttribute("data-sc", className);
      styleEl.textContent = `
                .${className} {
                    ${Object.entries(styles)
                      .map(([key, value]) => `${key}: ${value};`)
                      .join("\n")}
                }
            `;

      console.log("styleEl", styleEl);
      document.head.appendChild(styleEl);
      return () => {
        document.head.removeChild(styleEl);
      };
    }, [className]);

    return createElement(tag, { ...props, className }, props.children);
  };
}

const BlueButton = styled("button", {
  "background-color": "blue",
  color: "white",
  padding: "10px 20px",
});
export default HookTest;

const BoxLayout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    console.log("useEffect");
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.height < 100) {
        setExpanded(true);
        ref.current.style.height = "100px";
        ref.current.style.backgroundColor = "purple";
      }
    }
  }, []);
  return (
    <div
      ref={ref}
      style={{
        width: "100px",
        height: expanded ? "100px" : "20px",
        backgroundColor: "green",
        transition: "height 0.3s ease-in-out",
      }}
    >
      {expanded ? "Expanded" : "Collapsed"}
    </div>
  );
};
const BoxLayout2 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  useLayoutEffect(() => {
    console.log("useLayoutEffect");
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.height < 100) {
        setExpanded(true);
        ref.current.style.height = "100px";
        ref.current.style.backgroundColor = "purple";
      }
    }
  }, []);
  return (
    <div
      ref={ref}
      style={{
        width: "100px",
        height: expanded ? "100px" : "20px",
        backgroundColor: "green",
        transition: "height 0.3s ease-in-out",
      }}
    >
      {expanded ? "Expanded" : "Collapsed"}
    </div>
  );
};
