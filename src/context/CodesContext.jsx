import React, { createContext, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialState, reducer } from "../reducers/reducer";
import {
  ACTION_TYPE_FAILURE,
  ACTION_TYPE_LOADING,
  ACTION_TYPE_SUCCESS,
  callApi,
  formatError,
  notify,
} from "../utils";

const CodesContext = createContext();
export const initialCodeState = {
  data: [],
  loading: true,
  erorr: "",
};
const CodesProvider = ({ children }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [codes, dispatchCodes] = useReducer(reducer, initialState);
  const [savedCode, dispatchSaveCode] = useReducer(reducer, initialState);
  const [codeOutput, dispatchRunCode] = useReducer(reducer, initialState);
  const [code, dispatchCode] = useReducer(reducer, initialCodeState);
  const fetchCodes = async () => {
    try {
      dispatchCodes({ type: ACTION_TYPE_LOADING });
      const response = await callApi("get", "codes", true);
      dispatchCodes({ type: ACTION_TYPE_SUCCESS, payload: response.data });
    } catch (e) {
      dispatchCodes({ type: ACTION_TYPE_SUCCESS, payload: formatError(e) });
    }
  };

  const searchCodes = async (search) => {
    dispatchCodes({ type: ACTION_TYPE_LOADING });
    try {
      if (search === "") {
        notify("Please enter something to search");
        return;
      }

      const response = await callApi("post", "codes", true, { search });
      dispatchCodes({ type: ACTION_TYPE_SUCCESS, payload: response.data });
    } catch (e) {
      dispatchCodes({ type: ACTION_TYPE_SUCCESS, payload: formatError(e) });
    }
  };
  const createCode = async (fileName, language) => {
    if (fileName === "" || language === "") {
      notify("Please enter filename", "error");
      return;
    }
    const format = {
      python: "py",
      c: "c",
      cpp: "cpp",
      javascript: "js",
    };
    const response = await callApi("post", "codes/save", true, {
      title: fileName,
      code: "",
      format: format[language],
      lang: language,
    });
    navigate("/codes/" + response?.data?.data?._id);
  };
  const deleteCode = async (id) => {
    dispatchCodes({ type: ACTION_TYPE_LOADING });
    try {
      await callApi("delete", "codes/" + id, true);
      dispatchCodes({
        type: ACTION_TYPE_SUCCESS,
        payload: codes.data.filter((code) => code._id !== id),
      });
      notify("Deleted Successfully");
    } catch (e) {
      notify("Error deleting the file", "error");
      dispatchCodes({ type: ACTION_TYPE_FAILURE, payload: formatError(e) });
    }
  };
  const saveCode = async (title, code, format, lang, codeId) => {
    dispatchSaveCode({ type: ACTION_TYPE_LOADING });

    try {
      const response = callApi("post", "codes/save", true, {
        title,
        code,
        format,
        lang,
        _id: codeId,
      });

      dispatchSaveCode({ type: ACTION_TYPE_SUCCESS, payload: response.data });
      notify("Saved...");
    } catch (e) {
      dispatchSaveCode({ type: ACTION_TYPE_FAILURE, payload: formatError(e) });
    }
  };

  const runCode = async (title, code, format, language, input, codeId, ref) => {
    try {
      dispatchRunCode({ type: ACTION_TYPE_LOADING });
      await saveCode(title, code, format, language, codeId);

      let inputData = input;
      if (inputData.includes("\n")) inputData = inputData.split("\n");
      else if (inputData.includes(" ")) inputData = inputData.split(" ");
      const response = await callApi("post", "codes/compile", true, {
        id: codeId,
        input: inputData,
      });

      dispatchRunCode({ type: ACTION_TYPE_SUCCESS, payload: response.data });
      if (response.errors) {
        ref?.current?.scrollIntoView({ behavior: "smooth" });
      }
      notify("Compiled...");
    } catch (e) {
      dispatchRunCode({ type: ACTION_TYPE_FAILURE, payload: formatError(e) });
    }
  };

  const fetchCode = async (codeId, setShare) => {
    dispatchCode({ type: ACTION_TYPE_LOADING });
    try {
      const response = await callApi("get", "codes/" + codeId, true);
      setShare(response.data.share);
      dispatchCode({ type: ACTION_TYPE_SUCCESS, payload: response.data });
    } catch (e) {
      dispatchCode({ type: ACTION_TYPE_FAILURE, payload: formatError(e) });
    }
  };

  const shareCode = async (codeId, codeUserId, userId, setShare, share) => {
    if (codeUserId === userId) {
      await callApi("post", "codes/" + codeId, true, {
        share: !share,
      });
      setShare(!share);
      if (!share) notify("Copy the url to share the code");
      else notify("Disabled sharing");
    }
  };
  return (
    <CodesContext.Provider
      value={{
        codes,
        fetchCodes,
        createCode,
        dispatchRunCode,
        searchCodes,
        deleteCode,
        shareCode,
        fetchCode,
        code,
        runCode,
        saveCode,
        codeOutput,
        input,
        setInput,
      }}
    >
      {children}
    </CodesContext.Provider>
  );
};

const useCodes = () => useContext(CodesContext);
export { useCodes, CodesProvider };
