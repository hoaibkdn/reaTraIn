import { useRef, useCallback } from "react";

const useScroll = () => {
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const scrollToItem = useCallback((index: number) => {
      itemsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, []);

    return { itemsRef, scrollToItem };
};

export default useScroll;