import {
  memo,
  useEffect,
  useState,
  useId,
  useRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useTransition,
  useDeferredValue,
} from "react";
import {
  List as VirtualizedList,
  CellMeasurer,
  WindowScroller,
  CellMeasurerCache,
  InfiniteLoader,
} from "react-virtualized";
import LazyImage from "../components/LazyImage";
import { useUsers } from "~/hooks/useUsers";

// const initialState = {
//   count: 0,
//   list: [],
// };

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 310,
});

const List = () => {
  const [list, setList] = useState<any[]>([]);
  // const [state, dispatch] = useReducer(reducer, initialState, init);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(list);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [countLimit, setCountLimit] = useState(1);
  const { data, error, isLoading } = useUsers();
  console.log("data users ", data);
  // const deferredQuery = useDeferredValue(query);

  // const [rows, setRows] = useState(
  //   Array(10)
  //     .fill()
  //     .map((_, i) => `Item #${i}`)
  // );

  const isRowLoaded = ({ index }: { index: number }) => !!filtered[index];

  const loadMoreRows = async ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    if (!hasMore) return;

    const skip = startIndex; // API uses skip param for paging
    // const limit = 20;

    const res = await fetch(
      `https://dummyjson.com/products?limit=${20 * countLimit}&skip=${skip}`
    );
    const data = await res.json();
    console.log("data products loadmore ", data.products);
    setCountLimit(countLimit + 1);

    setFiltered(() => data.products);

    setHasMore(true);
    // stop loading when no more data
    // if (skip + data.products.length >= data.total) {
    //   setHasMore(false);
    // }
  };

  const listRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      const results = list.filter((item: any) =>
        item.description.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    });
  };

  // const filtered2 = list.filter((item) =>
  //   item.title.toLowerCase().includes(deferredQuery.toLowerCase())
  // );

  const itemsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<{ open: () => void; close: () => void }>(null);

  useEffect(() => {
    async function fetchList() {
      const fetch1 = fetch(
        "https://dummyjson.com/products?limit=" + 10 * countLimit
      );
      const fetch2 = fetch("https://dummyjson.com/users?limit=200");
      setCountLimit(countLimit + 1);
      const response = await fetch1;
      const response2 = await fetch2;

      const data = await response.json();
      const data2 = await response2.json();
      const newList = [...data.products];
      console.log("newList ", newList.length);
      setList(newList);
      setUsers(data2.users);
      setFiltered(newList);
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

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button onClick={() => setUsers([])}>Search</button>
      <button
        className="border-2 border-gray-300 p-2 rounded-md"
        onClick={() => setScrollIndex(15)}
      >
        Scroll to Item 15
      </button>
      <input
        value={query}
        onChange={handleChange}
        className="border-2 border-gray-300 p-2 rounded-md"
      />
      {isPending && <p>Loading...</p>}
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={1000}
        minimumBatchSize={3}
        threshold={1}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <div style={{ height }}>
                <VirtualizedList
                  ref={registerChild}
                  autoHeight={true}
                  width={500}
                  height={height}
                  scrollTop={scrollTop}
                  isScrolling={isScrolling}
                  rowCount={filtered.length}
                  rowHeight={cache.rowHeight}
                  deferredMeasurementCache={cache}
                  overscanRowCount={1}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={({ index, key, style, parent }) => {
                    const item = filtered[index];
                    return (
                      <CellMeasurer
                        key={key}
                        cache={cache}
                        columnIndex={0}
                        rowIndex={index}
                        parent={parent}
                      >
                        {({ measure }) => (
                          <div key={key} style={style}>
                            {item ? (
                              <Item
                                item={filtered[index]}
                                itemRef={setItemRef(index)}
                                user={users[index]}
                                measure={measure}
                              />
                            ) : (
                              <div>Loading...</div>
                            )}
                          </div>
                        )}
                      </CellMeasurer>
                    );
                  }}
                  scrollToIndex={10}
                  scrollToAlignment="start"
                />
              </div>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </div>
  );
};

const Item = memo(
  ({
    item,
    itemRef,
    user,
    measure,
  }: {
    item: any;
    itemRef: (el: HTMLDivElement | null) => void;
    user: any;
    measure: () => void;
  }) => {
    return (
      <>
        <div
          ref={itemRef}
          className="flex flex-col items-left justify-center gap-2 border-2 border-gray-300 p-2 rounded-md"
        >
          <h2 className="text-2xl font-bold">
            {item.id} - {item.title}
          </h2>
          {/* <p className="line-clamp-2">{item.description}</p> */}

          <p>{item.description}</p>
          {/* <img
            className="w-30 h-30"
            src={item.images[0]}
            alt={item.title}
            onLoad={measure}
          /> */}
          <LazyImage src={item.images[0]} alt={item.title} onLoad={measure} />
          <div className="flex items-center justify-between gap-2">
            {user && (
              <div className="flex items-center gap-2 w-1/2">
                <img
                  className="w-7 h-7 rounded-full"
                  src={user.image}
                  alt={user.firstName}
                  onLoad={measure}
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

// function NameField() {
//   const id = useId();
//   return (
//     <>
//       <label htmlFor={id}>Name:</label>
//       <input
//         id={id}
//         className="border-2 border-gray-300 p-2 rounded-md"
//         type="text"
//       />
//     </>
//   );
// }

// // no memo: 46.35ms

// function ButtonTurning() {
//   const redButtonRef = useRef<HTMLButtonElement>(null);
//   const changeColor = () => {
//     if (redButtonRef.current) {
//       redButtonRef.current.style.color = "red";
//     }
//   };

//   const triggerRedButton = () => {
//     if (redButtonRef.current) {
//       redButtonRef.current.click();
//     }
//   };
//   return (
//     <>
//       <button
//         onClick={triggerRedButton}
//         className="bg-blue-500 text-white p-2 rounded-md"
//       >
//         Trigger Red Button
//       </button>
//       <button
//         ref={redButtonRef}
//         onClick={changeColor}
//         className="bg-sky-300 text-white p-2 rounded-md"
//       >
//         Red Button
//       </button>
//     </>
//   );
// }

// function RAFAnimation() {
//   const [position, setPosition] = useState(0); // UI state
//   const frameRef = useRef<number | null>(null); // store frame id
//   const lastTimeRef = useRef<number | null>(null); // store last timestamp
//   const startTimeRef = useRef<number | null>(null); // store start timestamp

//   useEffect(() => {
//     const animate = (time: number) => {
//       if (!startTimeRef.current) {
//         startTimeRef.current = time;
//       }

//       const elapsed = time - startTimeRef.current!;

//       if (lastTimeRef.current != null) {
//         const delta = time - lastTimeRef.current;
//         setPosition((prev) => prev + delta * 0.1);
//       }

//       lastTimeRef.current = time!;

//       if (elapsed < 2000) {
//         frameRef.current = requestAnimationFrame(animate);
//       } else {
//         cancelAnimationFrame(frameRef.current!);
//       }
//     };
//     frameRef.current = requestAnimationFrame(animate);

//     // cleanup if component unmounts before 2s
//     return () => {
//       if (frameRef.current) {
//         cancelAnimationFrame(frameRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <h2>requestAnimationFrame with useRef (2s limit)</h2>
//       <div
//         style={{
//           width: 50,
//           height: 50,
//           background: "tomato",
//           position: "relative",
//           left: position,
//         }}
//       />
//     </div>
//   );
// }

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

// const CustomInput = forwardRef((props, ref) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useImperativeHandle(ref, () => ({
//     focus: () => inputRef.current?.focus(),
//     clear: () => (inputRef.current!.value = ""),
//   }));

//   return <input ref={inputRef} {...props} />;
// });

// const Modal = forwardRef((_, ref) => {
//   const [open, setOpen] = useState(false);

//   useImperativeHandle(
//     ref,
//     () => ({
//       open: () => setOpen(true),
//       close: () => setOpen(false),
//       toggle: () => setOpen((prev) => !prev),
//     }),
//     []
//   );

//   return (
//     open && (
//       <div className="modal">
//         <p>Modal Content</p>
//       </div>
//     )
//   );
// });

// function useTimer() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const id = setInterval(() => setCount((c) => c + 1), 1000);
//     return () => clearInterval(id);
//   }, []);

//   return count;
// }

// function Timer() {
//   const count = useTimer();
//   return <p>Count: {count}</p>;
// }

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       console.log("Element is visible!");
//     }
//   });
// }, {
//   root: null,        // viewport
//   rootMargin: "0px", // margin around root
//   threshold: 0.1     // % of element visible
// });

// observer.observe(document.querySelector("#target"));
