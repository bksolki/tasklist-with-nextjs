import { useState, useEffect } from "react";
import Router from "next/router";
import { loginUser } from "../../../lib/auth";
import { removeToken } from "../../../lib/token";
import { Input, Text, Center, Box, Button } from "@chakra-ui/react";
import { useAppAuthContext } from "../../../context/authContext";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuthInfo } = useAppAuthContext();

  useEffect(() => {
    removeToken();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await loginUser(username, password);
      if (data.payload && data.payload.token) {
        if (rememberMe) {
          window.localStorage.setItem("token", data.payload.token);
        } else {
          window.sessionStorage.setItem("token", data.payload.token);
        }
        setTimeout(() => {
          setAuthInfo({ isAuth: true, user: data.payload });
          Router.push("/todo-list");
        }, 500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Center>
      <form onSubmit={handleSubmit}>
        <Text>Login</Text>
        <Box>
          <Text htmlFor="usernameInput">Username</Text>
          <Input
            type="text"
            id="usernameInput"
            autoComplete="on"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box>
          <Text htmlFor="passwordInput">Password</Text>
          <Input
            type="password"
            id="passwordInput"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <div>
          <div>
            <input type="checkbox" id="RememberMeInput" onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="RememberMeInput">Remember Me</label>
          </div>
        </div>
        {errorMessage && <Text role="alert">{errorMessage}</Text>}
        <Button type="submit" disabled={isLoading}>
          Login
        </Button>
      </form>
    </Center>
  );
}
