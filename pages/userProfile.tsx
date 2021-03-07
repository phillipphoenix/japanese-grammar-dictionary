import { FC, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Page from "../components/Page";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { useAuth } from "../Providers/AuthProvider";
import DefaultMenu from "../components/DefaultMenu/DefaultMenu";

const UserProfile: FC = () => {
  const { user, refreshUser } = useAuth();
  /** Used for instance to indicate that the user is logging out or other async action. */
  const [isUserInputLocked, setIsUserInputLocked] = useState<boolean>(false);

  const [displayName, setDisplayName] = useState<string>(user?.displayName || "");

  const toast = useToast();

  useEffect(() => {
    setDisplayName(user?.displayName || "");
  }, [user]);

  const onUpdateUserProfile = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsUserInputLocked(true);
    user
      .updateProfile({
        displayName,
      })
      .then(() => refreshUser())
      .then(() => {
        toast({
          title: "Profile updated!",
          description: "Your profile was successfully updated.",
          status: "success",
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "An error occurred!",
          description: "We were not able to save your user profile. Please try again.",
          status: "error",
          isClosable: true,
        });
      })
      .then(() => setIsUserInputLocked(false));
  };

  return (
    <Page
      title="User Profile"
      tabTitle="User Profile - 日本語 Grammar Dictionary"
      menu={<DefaultMenu />}
    >
      <Center>
        <Box maxWidth={800}>
          <Box mb="1">
            <Link href="/">
              <Button leftIcon={<MdArrowBack />}>Back</Button>
            </Link>
          </Box>
          <Box p="5" shadow="md" bg="white" rounded="md">
            <Flex>
              <Heading>{user ? user.displayName || user.email : null}</Heading>
            </Flex>
            <Divider mt="2" mb="2" />
            <form onSubmit={onUpdateUserProfile}>
              <VStack>
                <FormControl isRequired>
                  <FormLabel>Display name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Mr. Teriyaki"
                    value={displayName}
                    onChange={(evt) => setDisplayName(evt.currentTarget.value)}
                    disabled={isUserInputLocked}
                  />
                  <FormHelperText>
                    You display name will be displayed on the entries you've edited.
                    <br />
                    You will not be credited on entries, if you do not have a display name.
                  </FormHelperText>
                </FormControl>
                <Button type="submit" colorScheme="green" isFullWidth isLoading={isUserInputLocked}>
                  Save
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default UserProfile;

// --- SERVER SIDE ---

import nookies from "nookies";
import { firebaseAdmin } from "../utils/api/firebaseAdmin";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: {},
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};
