import React from "react";
import { useCodes } from "../../context";
import Loader from "../Loader";
import "./output_section.scss";

export const OutputSection = () => {
  const { codeOutput } = useCodes();
  return (
    <div className="output-section">
      <h1>Output</h1>
      {codeOutput.loading ? (
        <Loader />
      ) : (
        <textarea id="output" defaultValue={codeOutput.data.output}></textarea>
      )}
    </div>
  );
};
