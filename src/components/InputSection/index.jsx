import React from "react";
import { useCodes } from "../../context";
import "./input_section.scss";

export const InputSection = () => {
  const { setInput, input, setShouldEmit } = useCodes();

  return (
    <div className="input-section">
      <h1>Input</h1>
      <textarea
        id="input"
        onChange={(e) => {
          setShouldEmit(true);
          setInput(e.target.value);
        }}
        defaultValue={input}
      ></textarea>
    </div>
  );
};
