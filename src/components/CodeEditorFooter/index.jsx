import React, { forwardRef, useEffect, useState } from "react";
import { useCodes, useSocket } from "../../context";
import "./CodeEditorFooter.scss";
export const CodeEditorFooter = forwardRef((props, ref) => {
  const { codeOutput } = useCodes();
  const { socket } = useSocket();
  const [error, setError] = useState(codeOutput);
  useEffect(() => {
    setError(codeOutput);
  }, [codeOutput]);
  useEffect(() => {
    socket.on(props.codeId + "output", ({ codeOutput }) => {
      setError(codeOutput);
    });
  }, [socket]);

  return (
    <div className="code-editor-footer" ref={ref}>
      <p className="errors">{error.data.errors}</p>
    </div>
  );
});
