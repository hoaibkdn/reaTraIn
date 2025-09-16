import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useInsertionEffect,
} from "react";

function BoxWithEffect() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("useEffect", new Date().getTime());
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.height < 100) {
        setExpanded(true); // re-render after paint → flicker
        ref.current.style.color = "red";
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: expanded ? 200 : 50,
        background: "lightblue",
        transition: "all 0.3s ease",
      }}
    >
      {expanded ? "Expanded" : "Collapsed"}
    </div>
  );
}

function BoxWithLayoutEffect() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ✅ Using useLayoutEffect (runs before paint → no flicker)
  useLayoutEffect(() => {
    console.log("useLayoutEffect", new Date().getTime());
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.height < 100) {
        setExpanded(true); // synchronous before paint → no flicker
        ref.current.style.color = "red";
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: expanded ? 200 : 50,
        background: "lightgreen",
        transition: "all 0.3s ease",
      }}
    >
      {expanded ? "Expanded" : "Collapsed"}
    </div>
  );
}

function styled(tag: any, styles: any) {
  return function StyledComponent(props: any) {
    const className = "sc-" + Object.keys(styles).join("-");
    
    useInsertionEffect(() => {
      const styleEl = document.createElement("style");
      styleEl.setAttribute("data-sc", className);
      styleEl.textContent = `
        .${className} {
          ${Object.entries(styles)
            .map(([k, v]) => `${k}: ${v};`)
            .join("\n")}
        }
      `;
      document.head.appendChild(styleEl);

      return () => {
        document.head.removeChild(styleEl);
      };
    }, [className]);

    return React.createElement(tag, { ...props, className }, props.children);
  };
}

const RedButton = styled("button", { color: "red", background: "black" });

const Test = () => {
  return (
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <BoxWithEffect />
        <BoxWithLayoutEffect />
      </div>
      <RedButton>Click me</RedButton>
    </>
  );
};

export default Test;
