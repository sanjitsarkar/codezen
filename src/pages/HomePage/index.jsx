import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { useAuth, useCodes } from "../../context";
import { useInput } from "../../hooks";
import { LANG_IMG } from "../../utils";
import "./Home.scss";

export const HomePage = () => {
  const [fileName, bindFileName, resetFileName] = useInput("");
  const [language, bindLanguage, resetLanguage] = useInput("python");
  const [search, bindSearch, resetSearch] = useInput("");
  const { isLoggedIn } = useAuth();

  const { codes, fetchCodes, createCode, searchCodes, deleteCode } = useCodes();
  useEffect(() => {
    if (isLoggedIn)
      (async () => {
        await fetchCodes();
      })();
  }, [isLoggedIn]);
  return (
    <div id="home">
      <div className="saved_codes">
        <form
          id="search"
          onSubmit={(e) => {
            e.preventDefault();
            searchCodes(search);
            resetSearch();
          }}
        >
          <input
            id="search-field"
            type="text"
            placeholder="Search code"
            {...bindSearch}
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
        <h2>Saved Codes</h2>
        <ul className="code-list">
          {codes?.loading &&
            <Loader />
 }
  {codes?.loading && codes?.data?.length?(
            codes?.data?.map((code) => (
              <li key={code._id}>
                {LANG_IMG[code.lang]}
                <Link to={"/codes/" + code._id}>
                  {code.title}.{code.format}
                </Link>
                <div
                  className="delete"
                  onClick={() => {
                    deleteCode(code._id);
                  }}
                >
                  <i className="fa fa-trash" />
                </div>
              </li>
            ))
          ) : (
            <p>There is no any saved codes </p>
          )}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCode(fileName, language);
        }}
        id="right"
      >
        <div className="file-name">
          <input type="text" placeholder="File name" {...bindFileName} />
          <select name="language" id="" {...bindLanguage}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="javascript">Javascript</option>
          </select>
        </div>
        <button>Create</button>
      </form>
    </div>
  );
};
