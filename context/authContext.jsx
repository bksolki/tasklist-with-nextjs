import { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { whoAmI } from "../lib/auth";
import { getToken } from "../lib/token";

const AppAuthContext = createContext();

export function AppAuth({ children }) {
  const [authInfo, setAuthInfo] = useState({
    isAuth: false,
    username: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const redirectToLogin = () => {
    Router.push("/auth/login");
  };

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      redirectToLogin();
    } else {
      (async () => {
        try {
          const data = await whoAmI();
          if (data.error === "Unauthorized") {
            redirectToLogin();
          }

          setAuthInfo({ isAuth: true, user: data.payload });
          Router.push("/todo-list");
        } catch (error) {
          redirectToLogin();
        }
      })();
    }
  };

  const AuthContextValue = {
    authInfo,
    setAuthInfo
  };

  return <AppAuthContext.Provider value={AuthContextValue}>{children}</AppAuthContext.Provider>;
}

export function useAppAuthContext() {
  const context = useContext(AppAuthContext);
  if (context === undefined) {
    throw new Error("useAppAuthContext must use under AppAuthContext");
  }
  return context;
}
