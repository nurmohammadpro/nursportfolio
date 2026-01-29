//app/hooks/usePasswordVisibility.ts
import { useState } from "react";

export function usePasswordVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return { isVisible, toggleVisibility };
}
