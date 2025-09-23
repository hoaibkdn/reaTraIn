import { useEffect, useState, useRef } from "react";

function LazyImage({
  src,
  alt,
  onLoad,
}: {
  src: string;
  alt: string;
  onLoad: () => void;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "10px" } // preload before fully visible
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ minHeight: 80 }}>
      {visible ? (
        <img src={src} alt={alt} onLoad={onLoad} style={{ width: 100 }} />
      ) : (
        <div style={{ height: 100, width: 100, background: "#cecece" }} />
      )}
    </div>
  );
}

export default LazyImage;
