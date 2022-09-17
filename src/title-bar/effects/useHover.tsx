import { useState, useRef, useEffect } from "react";

export function useHoverWithRef<T extends HTMLElement>(
  ref: React.RefObject<T>
): boolean {
  // Hover state management
  const [hovered, setHovered] = useState(false);

  // Simple effect, just bind and unbind the event handlers
  useEffect(() => {
    const node = ref.current;
    if (node) {
      // Event handlers
      const enter = () => setHovered(true);
      const leave = () => setHovered(false);

      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);
      node.addEventListener("focus", enter);
      node.addEventListener("blur", leave);
      return () => {
        node.removeEventListener("mouseenter", enter);
        node.removeEventListener("mouseleave", leave);
        node.removeEventListener("focus", enter);
        node.removeEventListener("blur", leave);
      };
    }
    return;
  }, [ref.current]);

  return hovered;
}

export default function useHover<T extends HTMLElement>(): [
  React.RefObject<T>,
  boolean
] {
  // Reference to the element we're listen for events from
  const ref = useRef<T>(null);

  return [ref, useHoverWithRef(ref)];
}
