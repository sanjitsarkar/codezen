import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [share, setShare] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await fetchCode(codeId, setShare);
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
  }, [code]);
  const ref = useRef(null);
  return (
    <>
      <div className="code-editor-page">
        {code.loading && <Loader />}
        {!code.loading && code?.data?.user_id === user?.data?._id && (
          <>
            <CodeEditor _code={code.data} user_id={user?.data?._id} />
            <InputSection />
            <OutputSection />
          </>
        )}
      </div>
      <CodeEditorFooter ref={ref} />
    </>
  );
};
