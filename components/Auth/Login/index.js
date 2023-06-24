import { useState, useEffect } from "react";
import Router from "next/router";
import { loginUser } from "../../../lib/auth";
import { Input, Text, Center, Box, Button } from "@chakra-ui/react";
import { useAppAuthContext } from "../../../context/authContext";
import { Spinner } from "@chakra-ui/react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { authInfo, setAuthInfo } = useAppAuthContext();

  useEffect(() => {
    const recentLoginUsername = window.localStorage.getItem("recentLogin");
    if (recentLoginUsername) setUsername(recentLoginUsername);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(username, password);
      if (data.payload && data.payload.token) {
        window.localStorage.setItem("token", data.payload.token);
        window.localStorage.setItem("recentLogin", username);
        window.sessionStorage.setItem("token", data.payload.token);

        setAuthInfo({ isAuth: true, user: data.payload });
        Router.push("/todo-list");
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } else {
        setErrorMessage(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Box bg="linear-gradient(-135deg, #c850c0, #4158d0)" height="100vh">
      <Center minW="250px" paddingTop={[15, 20, 30]}>
        <form onSubmit={handleSubmit}>
          <Box
            width={["calc(100vw - 30px)", 300, 350]}
            minW="250px"
            bg="#fbffff"
            padding="15px"
            borderRadius="10px"
            backgroundColor="rgba(255,255,255,0.3)"
          >
            <Text color="#2a2a2a" fontSize={[22, 20, 18]} fontWeight="bold">
              Login
            </Text>
            <Box mt="10px">
              <Text htmlFor="usernameInput" color="#2a2a2a" fontSize={[18, 16, 14]}>
                Username
              </Text>
              <Input
                type="text"
                borderColor="#2a2a2a"
                color="#fff"
                id="usernameInput"
                autoComplete="on"
                placeholder="Username"
                value={username}
                _placeholder={{ opacity: 1, color: "#ababab" }}
                _focus={{ borderColor: "#fff" }}
                _hover={{ borderColor: "#fff" }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box mt="10px">
              <Text htmlFor="passwordInput" color="#2a2a2a" fontSize={[18, 16, 14]}>
                Password
              </Text>
              <Input
                type="password"
                borderColor="#2a2a2a"
                id="passwordInput"
                autoComplete="off"
                color="#fff"
                placeholder="Password"
                _placeholder={{ opacity: 1, color: "#ababab" }}
                _focus={{ borderColor: "#fff" }}
                _hover={{ borderColor: "#fff" }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            {/* <Box>
          <Box>
            <input type="checkbox" id="RememberMeInput" onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="RememberMeInput">Remember Me</label>
          </Box>
        </Box> */}
            {errorMessage && (
              <Text role="alert" color="red">
                {errorMessage}
              </Text>
            )}
            <Button w="100%" marginTop="15px" backgroundColor="#b3e8ff3b" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner marginRight="15px" /> : <Text>Login</Text>}
            </Button>
          </Box>
        </form>
      </Center>
    </Box>
  );
}
