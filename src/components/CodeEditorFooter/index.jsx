import React, { forwardRef } from "react";
import { useCodes } from "../../context";
import "./CodeEditorFooter.scss";
export const CodeEditorFooter = forwardRef((props, ref) => {
  const { codeOutput } = useCodes();
  return (
    <div className="code-editor-footer" ref={ref}>
      <p className="errors">{codeOutput.data.errors}</p>
    </div>
  );
});
