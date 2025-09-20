import {
  memo,
  useEffect,
  useState,
  useId,
  useRef,
  forwardRef,
  useCallback,
  useReducer,
  type ForwardedRef,
  useImperativeHandle,
  useTransition,
  useDeferredValue,
} from "react";

const initialState = {
  count: 0,
  list: [],
};

function init(initialState: { count: number; list: any[] }) {
  return {
    count: initialState.count + 10000000 * 300 + 1000,
    list: initialState.list,
  };
}

const reducer = (state: { count: number; list: any[] }, action: any) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "addItem":
      return { ...state, list: [...state.list, action.item] };
    case "removeItem":
      return {
        ...state,
        list: state.list.filter((item: any) => item.id !== action.id),
      };
    default:
      return state;
  }
};

const List = () => {
  const [list, setList] = useState<any[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(list);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<any[]>([]);
  const deferredQuery = useDeferredValue(query);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const results = list.filter((item: any) =>
      item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(results);
    // startTransition(() => {
    //   const results = list.filter((item: any) =>
    //     item.description.toLowerCase().includes(value.toLowerCase())
    //   );
    // });
  };

  // const filtered2 = list.filter((item) =>
  //   item.title.toLowerCase().includes(deferredQuery.toLowerCase())
  // );

  const itemsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<{ open: () => void; close: () => void }>(null);

  useEffect(() => {
    async function fetchList() {
      const fetch1 = fetch("https://dummyjson.com/products?limit=200");
      const fetch2 = fetch("https://dummyjson.com/users?limit=200");
      const response = await fetch1;
      const response2 = await fetch2;

      Promise.any([
        fetch("https://dummyjson.com/products?limit=200"), 
        fetch("https://dummyjson.com/users?limit=200"),   
      ])
        .then(res => res.json())
        .then(data => console.log("Any result:", data))
        .catch(err => console.error("All failed:", err.errors));

      // ----------------------------
      // const timeout = (ms) =>
      //   new Promise((_, reject) =>
      //     setTimeout(() => reject(new Error("⏰ Timeout!")), ms)
      //   );
      
      // Promise.race([
      //   fetch("https://dummyjson.com/products?limit=200"),
      //   timeout(2000),
      // ])
      //   .then((res) => res.json())
      //   .then((data) => console.log("Data:", data))
      //   .catch((err) => console.error("Error:", err.message));

      // ----------------------------
      // Promise.race([
      //   fetch("https://dummyjson.com/products?limit=200"),
      //   fetch("https://dummyjson.com/users?limit=200"),
      // ])
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log("First response wins:", data);
      //   })
      //   .catch((err) => {
      //     console.error(" First error:", err);
      //   });

      // ---------------------------- 
      // Promise.all([
      //   fetch("https://dummyjson.com/products?limit=200"),
      //   fetch("https://dummyjson.com/users2?limit=200")
      // ]).then(([productsRes, usersRes]) => {
      //   return Promise.all([productsRes.json(), usersRes.json()])
      // })
      // .catch((error) => {
      //   console.log("error ", error);
      // });

      // ------------------------------
      // Promiss allSettled
      // Promise.allSettled([
      //   fetch("https://dummyjson.com/products?limit=200"),
      //   fetch("https://dummyjson.com/users1?limit=200"),
      // ])
      //   .then((results) => {
      //     return Promise.allSettled(
      //       results.map((r) =>
      //         r.status === "fulfilled"
      //           ? r.value.json()
      //           : Promise.reject(r.reason)
      //       )
      //     );
      //   })
      //   .then((parsedResults) => {
      //     console.log("parsedResults ", parsedResults);
      //   })
      //   .catch((err) => {
      //     console.error("Cached Error:", err);
      //   });

      // const response = await fetch("https://dummyjson.com/products?limit=200");
      // const response2 = await fetch("https://dummyjson.com/users?limit=200");
      const data = await response.json();
      const data2 = await response2.json();
      const newList = [
        // ...data.products.slice(0,10),
        ...data.products,
        // ...data.products,
        // ...data.products,
        // ...data.products,
        // ...data.products,
      ];
      console.log("newList ", newList.length);
      setList(newList);
      setUsers(data2.users);
      setFiltered(newList);
      // dispatch({ type: "addItem", item: data.products });
      dispatch({ type: "increment", count: data.products.length });
      // setCount((prev) => prev + data.products.length);
    }
    fetchList();
  }, []);
  const fetchList = async () => {
    const response = await fetch("https://dummyjson.com/products?limit=20");
    const data = await response.json();
    setList((prev: any[]) => [
      ...prev,
      ...(data.products?.slice(10, 20) || []),
    ]);
    // setCount((prev) => prev + data.products.length);
  };

  const handleFetchList = async () => {
    await fetchList();
  };

  const scrollToItem = (index: number) => {
    itemsRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const setItemRef = useCallback((itemId: number) => {
    return (el: HTMLDivElement | null) => {
      if (el) itemsRef.current[itemId] = el;
    };
  }, []);

  const handleAddItem = () => {
    setUsers((prev) => [
      { id: prev.length + 1, firstName: "Item " + (prev.length + 1) },
      ...prev,
    ]);
    setFiltered((prev) => [
      { id: prev.length + 1, title: "Item " + (prev.length + 1) },
      ...prev,
    ]);
    // console.log("users --- ", users);
    console.log("list --- ", list);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* <h1>List</h1> */}
      {/* <button onClick={handleFetchList}>Count: {count}</button> */}
      {/* <button onClick={() => dispatch({ type: "increment" })}>
        Count: {state.count} {list.length}
      </button>
      <button onClick={() => scrollToItem(10)}>Scroll to Item 10</button> */}
      {/* <button onClick={() => modalRef.current?.open()}>Open Modal</button>
      <button onClick={() => modalRef.current?.close()}>Close Modal</button> */}
      <button onClick={() => setUsers([])}>Search</button>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => handleAddItem()}
      >
        Add item
      </button>
      <input
        value={query}
        onChange={handleChange}
        className="border-2 border-gray-300 p-2 rounded-md"
      />
      {isPending && <p>Loading...</p>}
      {/* <Modal ref={modalRef} /> */}

      {/* <Counter value={count} />
      <NameField />
      <NameField />
      <ButtonTurning />
      <RAFAnimation /> */}
      {filtered.map((item: any, index) => (
        <Item
          key={item.id}
          item={item}
          itemRef={setItemRef(index)}
          user={users[index]}
        />
      ))}
    </div>
  );
};

const Item = memo(
  ({
    item,
    itemRef,
    user,
  }: {
    item: any;
    itemRef: (el: HTMLDivElement | null) => void;
    user: any;
  }) => {
    // console.log("item ", item);
    return (
      <>
        <div
          ref={itemRef}
          className="flex flex-col items-left justify-center gap-2 border-2 border-gray-300 p-2 rounded-md w-1/2"
        >
          <h2 className="text-2xl font-bold">
            {item.id} - {item.title}
          </h2>
          <p>{item.description}</p>
          <img className="w-30 h-30" src={item.images?.[0]} alt={item.title} />
          <div className="flex items-center justify-between gap-2">
            {user && (
              <div className="flex items-center gap-2 w-1/2">
                <img
                  className="w-7 h-7 rounded-full"
                  src={user.image}
                  alt={user.firstName}
                />
                <p className="text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            )}
            {user && user.id % 3 === 0 ? (
              <button className="border-2 border-green-500 p-2 rounded-md text-sm">
                Like
              </button>
            ) : (
              <button className="border-2 border-gray-300 p-2 rounded-md text-sm">
                Unlike
              </button>
            )}
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    // console.log("prevProps ", prevProps);
    // console.log("nextProps ", nextProps);
    return prevProps.item.id === nextProps.item.id;
  }
);

export default List;

function NameField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Name:</label>
      <input
        id={id}
        className="border-2 border-gray-300 p-2 rounded-md"
        type="text"
      />
    </>
  );
}

// no memo: 46.35ms

function ButtonTurning() {
  const redButtonRef = useRef<HTMLButtonElement>(null);
  const changeColor = () => {
    if (redButtonRef.current) {
      redButtonRef.current.style.color = "red";
    }
  };

  const triggerRedButton = () => {
    if (redButtonRef.current) {
      redButtonRef.current.click();
    }
  };
  return (
    <>
      <button
        onClick={triggerRedButton}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Trigger Red Button
      </button>
      <button
        ref={redButtonRef}
        onClick={changeColor}
        className="bg-sky-300 text-white p-2 rounded-md"
      >
        Red Button
      </button>
    </>
  );
}

function RAFAnimation() {
  const [position, setPosition] = useState(0); // UI state
  const frameRef = useRef<number | null>(null); // store frame id
  const lastTimeRef = useRef<number | null>(null); // store last timestamp
  const startTimeRef = useRef<number | null>(null); // store start timestamp

  useEffect(() => {
    const animate = (time: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current!;

      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;
        setPosition((prev) => prev + delta * 0.1);
      }

      lastTimeRef.current = time!;

      if (elapsed < 2000) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frameRef.current!);
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    // cleanup if component unmounts before 2s
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>requestAnimationFrame with useRef (2s limit)</h2>
      <div
        style={{
          width: 50,
          height: 50,
          background: "tomato",
          position: "relative",
          left: position,
        }}
      />
    </div>
  );
}

// function Counter({ value }: { value: number }) {
//   const prevValue = useRef<number | null>(null);

//   useEffect(() => {
//     prevValue.current = value;
//   }, [value]);

//   return (
//     <p>
//       Now: {value}, before: {prevValue.current}
//     </p>
//   );
// }

function Counter({ value }: { value: number }) {
  const prev = useRef(value);
  return (
    <p>
      Now: {value}, before: {prev.current}
    </p>
  );
}

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => (inputRef.current!.value = ""),
  }));

  return <input ref={inputRef} {...props} />;
});

const Modal = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((prev) => !prev),
    }),
    []
  );

  return (
    open && (
      <div className="modal">
        <p>Modal Content</p>
      </div>
    )
  );
});

function useTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return count;
}

function Timer() {
  const count = useTimer();
  return <p>Count: {count}</p>;
}
