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
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  List as VirtualizedList,
  CellMeasurer,
  WindowScroller,
  CellMeasurerCache,
  InfiniteLoader,
} from "react-virtualized";
import LazyImage from "../components/LazyImage";
import { useProducts } from "~/hooks/useProducts";
import useProductsStore from "~/stores/useProductsStore";

// const initialState = {
//   count: 0,
//   list: [],
// };

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 310,
});

const List = () => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  
  // Fetch products data using useInfiniteQuery
  const { 
    data: productsData, 
    error: productsError, 
    isLoading: productsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useProducts(20)
  const { products, setProducts } = useProductsStore();

  // Fetch users data using useQuery
  const { 
    data: usersData, 
    error: usersError, 
    isLoading: usersLoading 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch("https://dummyjson.com/users?limit=200");
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const list = useMemo(() => 
    productsData?.pages.flatMap((page) => page.products) || [], 
    [productsData]
  );
  const users = usersData?.users || [];

  // setProducts(list);
  // const [filtered, setFiltered] = useState(list);
  // const deferredQuery = useDeferredValue(query);
  // const isRowLoaded = useCallback(({ index }: { index: number }) => !!filtered[index], [filtered]);
  const isRowLoaded = useCallback(({ index }: { index: number }) => !!products[index], [products]);

  const loadMoreRows = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return Promise.resolve();
    
    return fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      const results = list.filter((item: any) =>
        item.description.toLowerCase().includes(value.toLowerCase())
      );
      // setProducts(results);
      // setFiltered(results);
    });
  };

  // const filtered2 = list.filter((item) =>
  //   item.title.toLowerCase().includes(deferredQuery.toLowerCase())
  // );

  const itemsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<{ open: () => void; close: () => void }>(null);

  // Update filtered list when products data changes
  useEffect(() => {
    if (list.length > 0) {
      setProducts(list);
    }
  }, [list.length]);
  const handleFetchList = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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

  // Show loading state
  if (productsLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (productsError || usersError) {
    return <div>Error loading data: {productsError?.message || usersError?.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button onClick={handleFetchList}>Load More Products</button>
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
      {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load more' : 'No more'}
      {isPending && <p>Filtering...</p>}
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={hasNextPage ? products.length + 1 : products.length}
        minimumBatchSize={1}
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
                  rowCount={products.length}
                  rowHeight={cache.rowHeight}
                  deferredMeasurementCache={cache}
                  overscanRowCount={1}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={({ index, key, style, parent }) => {
                    const item = products[index];
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
                                item={products[index]}
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
