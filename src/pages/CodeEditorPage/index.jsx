import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CodeEditor,
  CodeEditorFooter,
  InputSection,
  Loader,
  OutputSection,
} from "../../components";
import { useAuth, useCodes } from "../../context";
import "./CodeEditorPage.scss";

export const CodeEditorPage = () => {
  const { code, fetchCode } = useCodes();
  const { user } = useAuth();
  const codeId = useParams().id;
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await fetchCode(codeId);
    })();
  }, [codeId]);

  useEffect(() => {
    if (
      !code.loading &&
      code?.data?.user_id !== user?.data?._id &&
      !code?.data?.share
    ) {
      navigate("/");
    }
  }, [code, navigate, user]);
  const ref = useRef(null);
  return (
    <>
      <div className="code-editor-page">
        {code.loading && <Loader />}
        {!code.loading && (
          <>
            <CodeEditor _code={code.data} user_id={user?.data?._id} />
            <InputSection />
            <OutputSection codeId={codeId} />
          </>
        )}
      </div>
      <CodeEditorFooter ref={ref} codeId={codeId} />
    </>
  );
};
