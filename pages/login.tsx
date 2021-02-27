import { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Page from "../components/Page";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { firebase } from "../utils/firebase";

const LogIn: FC = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const onShowHidePassword = () => setShowPassword(!showPassword);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const onLogin = () => {
    setIsLoggingIn(true);

    // When the user signs in with email and password.
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // Redirect to new page after succesfully signing in.
        push("/backoffice");
      })
      .catch((err) => console.error(err))
      .then(() => {
        // Reset is logging in state.
        setIsLoggingIn(false);
      });
  };

  return (
    <Page title="Log in to backoffice" tabTitle="Log in - 日本語 Grammar Dictionary">
      <Center mb="5">
        <VStack spacing="5">
          <Box maxWidth={600} p="5" shadow="md" bg="white" rounded="md">
            <Heading>Log In</Heading>
            <Divider mt="2" mb="2" />
            <form>
              <VStack spacing="3">
                <FormControl isRequired isDisabled={isLoggingIn}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="example@test.com"
                    value={email}
                    onChange={(evt) => setEmail(evt.currentTarget.value)}
                  />
                </FormControl>
                <FormControl isRequired isDisabled={isLoggingIn}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(evt) => setPassword(evt.currentTarget.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        disabled={isLoggingIn}
                        h="1.75rem"
                        size="sm"
                        onClick={onShowHidePassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  type="submit"
                  onClick={onLogin}
                  isFullWidth
                  colorScheme="green"
                  isLoading={isLoggingIn}
                  loadingText="Logging in"
                >
                  Log in
                </Button>
              </VStack>
            </form>
          </Box>
          <Link href="/">
            <Button>Back to main page</Button>
          </Link>
        </VStack>
      </Center>
    </Page>
  );
};

export default LogIn;
