import "ace-builds/src-noconflict/ace";
import {
  default as Beautify,
  default as beautify,
} from "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import React, { createRef, useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useParams } from "react-router-dom";
import Switch from "react-switch";
import { useAuth, useCodes } from "../../context";
import { changeFileFormat } from "../../utils";
import "./code_editor.scss";

export const CodeEditor = ({ _code, user_id }) => {
  const languages = ["python", "c_cpp", "javascript"];
  const [compilerLanguage, setCompilerLanguage] = useState(languages[0]);
  const { id: codeId } = useParams();
  const [title, setTitle] = useState(_code.title);
  const [format, setFormat] = useState(_code.format);
  const [fileName, setFileName] = useState(title + "." + format);
  const [language, setLanguage] = useState(_code.lang);
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(_code.code);
  const [run, setRun] = useState(false);
  const [share, setShare] = useState(_code?.share);
  const [toggleClass, setToggleClass] = useState("file-name");
  const ref = createRef();
  const { shareCode, fetchCode, runCode, saveCode, input } = useCodes();
  const { user } = useAuth();

  useEffect(() => {
    changeFileFormat(
      language,
      languages,
      setFileName,
      fileName,
      setCompilerLanguage,
      code,
      setCode
    );
  }, []);

  const toggleEdit = () => {
    setEdit(!edit);
    if (edit) setToggleClass("file-name edit");
    else setToggleClass("file-name");
  };

  useEffect(() => {
    setFormat(fileName.split(".")[1]);
    setTitle(fileName.split(".")[0]);
  }, [fileName]);

  useEffect(() => {
    if (language !== "python")
      beautify.beautify(ref.current.refEditor.env.editor.session);
  }, []);
  return (
    <div className="code-editor">
      <div className="top-bar">
        <input
          className={toggleClass}
          value={fileName}
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          onDoubleClick={() => {
            toggleEdit();
          }}
        />

        <div className="right">
          <div className="language">
            <select
              name="language"
              id=""
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                changeFileFormat(
                  e.target.value,
                  languages,
                  setFileName,
                  fileName,
                  setCompilerLanguage,
                  code,
                  setCode
                );
              }}
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="javascript">Javascript</option>
            </select>
          </div>
          <div
            className="save"
            onClick={(e) => {
              if (language !== "python")
                beautify.beautify(ref.current.refEditor.env.editor.session);
              saveCode(title, code, format, language, codeId);
            }}
          >
            <i className="fas fa-save    "></i>
          </div>

          <div
            className="run"
            onClick={() => {
              runCode(title, code, format, language, input, codeId, ref);
              setRun(!run);
            }}
          >
            <i className="fa fa-play" aria-hidden="true"></i>
          </div>
          {_code.user_id == user?.data?._id && (
            <label className="share" htmlFor="">
              <span>Share</span>
              <Switch
                placeholder="Share"
                width={60}
                height={25}
                className="share-switch"
                onChange={() =>
                  shareCode(
                    codeId,
                    _code.user_id,
                    user.data._id,
                    setShare,
                    share
                  )
                }
                checked={share}
              />
            </label>
          )}
        </div>
      </div>
      <AceEditor
        ref={ref}
        style={{
          height: "93%",
          width: "100%",
          background: "hsl(209, 37%, 15%)",
        }}
        placeholder=""
        theme="monokai"
        mode={compilerLanguage}
        onChange={(currentCode) => setCode(currentCode)}
        fontSize={18}
        commands={Beautify.commands}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={false}
        value={code}
        setOptions={{
          displayIndentGuides: true,
          enableMultiselect: true,
          fixedWidthGutter: true,
          mergeUndoDeltas: "always",
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,

          showLineNumbers: true,
          animatedScroll: true,
          autoScrollEditorIntoView: true,
          fadeFoldWidgets: true,
          tabSize: 4,
          cursorStyle: "smooth",
        }}
      />
    </div>
  );
};
