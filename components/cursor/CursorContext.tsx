"use client";

import React, { createContext, useContext, useState } from "react";

export type CursorMode = "default" | "pointer" | "play" | "view" | "drag" | "scrub" | "hidden";

interface CursorContextType {
  cursorMode: CursorMode;
  cursorText: string;
  setCursor: (mode: CursorMode, text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorMode: "default",
  cursorText: "",
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [cursorText, setCursorText] = useState<string>("");

  const setCursor = (mode: CursorMode, text?: string) => {
    setCursorMode(mode);
    setCursorText(text || "");
  };

  const resetCursor = () => {
    setCursorMode("default");
    setCursorText("");
  };

  return (
    <CursorContext.Provider value={{ cursorMode, cursorText, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
