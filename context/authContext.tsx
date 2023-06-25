import { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { whoAmI } from "../lib/auth";
import { getToken } from "../lib/token";

interface AuthInfo {
  isAuth: boolean;
  user?: any;
}

interface AppAuthContextValue {
  authInfo: AuthInfo;
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo>>;
}

const AppAuthContext = createContext<AppAuthContextValue | undefined>(undefined);

const AppAuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    isAuth: false,
    user: {}
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
};

const useAppAuthContext = () => {
  const context = useContext(AppAuthContext);
  if (context === undefined) {
    throw new Error("useAppAuthContext must use under AppAuthContext");
  }
  return context;
};

export { AppAuthProvider, useAppAuthContext };
