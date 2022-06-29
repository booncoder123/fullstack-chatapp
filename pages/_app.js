import { ChakraProvider, Spinner, Center } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../components/Login";
import { auth } from "../firebaseconfig";
import UserController from "../mixins/user";
import { useEffect } from "react";

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const checkUser = async () => {
      let uid = getCookie("uid");
      const user = await UserController.getUserByUid(uid);
      if (!user) {
        await UserController.postUser(uid, "Poom1");
      }
    };

    checkUser();
  }, []);

  if (user) {
    document.cookie = `uid=${user.uid}`;
    // check fire store have this id or not
  }

  if (loading) {
    return (
      <ChakraProvider>
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      </ChakraProvider>
    );
  }

  if (!user) {
    return (
      <ChakraProvider>
        <Login />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
