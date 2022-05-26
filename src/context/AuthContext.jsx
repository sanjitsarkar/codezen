import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { initialState, reducer } from "../reducers/reducer";
import {
  ACTION_TYPE_FAILURE,
  ACTION_TYPE_LOADING,
  ACTION_TYPE_SUCCESS,
  callApi,
  formatError,
  initialLoginCredState,
  initialSignupCredState,
  notify,
} from "../utils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profile, dispatchProfile] = useReducer(reducer, initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState();
  const [loginCred, setLoginCred] = useState(initialLoginCredState);
  const [signupCred, setSignupCred] = useState(initialSignupCredState);

  const signUp = async () => {
    dispatch({ type: ACTION_TYPE_LOADING });
    try {
      if (signupCred.password !== signupCred.confirmPassword) {
        notify("Passwords do not match", "error");
        dispatch({ type: ACTION_TYPE_SUCCESS, payload: [] });

        return;
      }

      const result = await callApi("post", "auth/signup", false, {
        name: signupCred.name,
        email: signupCred.email,
        password: signupCred.password,
      });

      notify(`Welcome, ${result.data.name}`);
      setLoginCred(initialLoginCredState);
      setSignupCred(initialSignupCredState);
      dispatch({ type: ACTION_TYPE_SUCCESS, payload: result.data });

      setIsLoggedIn(true);
    } catch (err) {
      notify(formatError(err), "error");

      dispatch({ type: ACTION_TYPE_FAILURE, payload: formatError(err) });
    }
  };
  const updateUserInfo = async (user) => {
    try {
      dispatchProfile({ type: ACTION_TYPE_LOADING });
      const result = await callApi("put", "user", true, user);
      dispatchProfile({ type: ACTION_TYPE_SUCCESS, payload: result.data });
    } catch (err) {
      notify(formatError(err), "error");
      dispatchProfile({ type: ACTION_TYPE_FAILURE, payload: formatError(err) });
    }
  };
  const logIn = async () => {
    dispatch({ type: ACTION_TYPE_LOADING });
    try {
      const result = await callApi("post", "auth/login", false, {
        email: loginCred.email,
        password: loginCred.password,
      });

      notify(`Welcome, ${result.data.name}`);
      setLoginCred(initialLoginCredState);
      setSignupCred(initialSignupCredState);
      dispatch({ type: ACTION_TYPE_SUCCESS, payload: result.data });

      setIsLoggedIn(true);
    } catch (err) {
      notify(formatError(err), "error");

      dispatch({ type: ACTION_TYPE_FAILURE, payload: formatError(err) });
    }
  };
  const getUserInfo = async () => {
    try {
      dispatchProfile({ type: ACTION_TYPE_LOADING });

      const result = await callApi("get", "user", true);

      const { _id, email, name, updatedAt, createdAt } = result.data;
      dispatchProfile({
        type: ACTION_TYPE_SUCCESS,
        payload: {
          _id,
          email,
          name,
          updatedAt,
          createdAt,
        },
      });
    } catch (err) {
      dispatchProfile({ type: ACTION_TYPE_FAILURE, payload: formatError(err) });
    }
  };

  const logOut = () => {
    notify(`Goodbye, ${state.data.name}`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    dispatch({ type: ACTION_TYPE_SUCCESS, payload: [] });
  };

  useEffect(() => {
    if (isLoggedIn) {
      setToken(localStorage.getItem("token"));
      localStorage.setItem("user", JSON.stringify(state.data));
      localStorage.setItem("token", state.data.token);
    }
  }, [isLoggedIn, state]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      setIsLoggedIn(true);
      dispatch({
        type: ACTION_TYPE_SUCCESS,
        payload: JSON.parse(localStorage.getItem("user")),
      });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        user: state,
        setUser: dispatch,
        isLoggedIn,
        signUp,
        logIn,
        logOut,
        loginCred,
        setLoginCred,
        signupCred,
        setSignupCred,
        dispatchProfile,
        profile,
        getUserInfo,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
