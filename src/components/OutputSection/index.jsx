import React, { useEffect, useState } from "react";
import { useCodes, useSocket } from "../../context";
import Loader from "../Loader";
import "./output_section.scss";

export const OutputSection = ({ codeId }) => {
  const { codeOutput } = useCodes();
  const [output, setOutput] = useState(codeOutput);
  useEffect(() => {
    setOutput(codeOutput);
  }, [codeOutput]);
  const { socket } = useSocket();
  useEffect(() => {
    socket.on(codeId + "output", ({ codeOutput }) => {
      setOutput(codeOutput);
    });
  }, [socket]);
  useEffect(() => {
    socket.emit("run", { codeId, codeOutput });
  }, [codeOutput]);
  return (
    <div className="output-section">
      <h1>Output</h1>
      {output.loading ? (
        <Loader />
      ) : (
        <textarea id="output" defaultValue={output.data.output}></textarea>
      )}
    </div>
  );
};
