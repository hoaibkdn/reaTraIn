import { useState, useTransition, useEffect, useCallback } from "react";

const useList = (url: string) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    console.log("value ", value);

    startTransition(() => {
      const results = list.filter((item: any) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
    });
  }, [list]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const newList = [
          ...data.products,
          ...data.products,
          ...data.products,
          ...data.products,
          ...data.products,
        ];
        setList(newList);
        setFiltered(newList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  return { query, filtered, isPending, handleChange };
};

export default useList;
