import React, { useEffect, useRef, useState } from "react";
import "./Tooltip.css";

type Props = {
  children: React.ReactNode;
  text: string;
  delay?: number;
};

const Tooltip = ({ children, text, delay = 500 }: Props) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    setVisible(false);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current); // Clear the timeout when the user leaves
    }
  };

  useEffect(() => {
    const targetElement = targetRef.current;

    if (targetElement) {
      targetElement.addEventListener("mouseenter", showTooltip);
      targetElement.addEventListener("mouseleave", hideTooltip);

      return () => {
        targetElement.removeEventListener("mouseenter", showTooltip);
        targetElement.removeEventListener("mouseleave", hideTooltip);
      };
    }
  }, []);

  return (
    <div className="tooltip-container" ref={targetRef}>
      {children}
      {visible && (
        <div className="tooltip" ref={tooltipRef}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
