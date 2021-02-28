import { FC } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Page from "../../components/Page";
import DefaultMenu from "../../components/DefaultMenu/DefaultMenu";
import { Box, Center, Divider, Heading, useToast } from "@chakra-ui/react";
import { EntryEditor } from "../../components/EntryEditor/EntryEditor";

const Create: FC = () => {
  const toast = useToast();
  const { push } = useRouter();

  /**
   * Submit the create entry form.
   */

  const createEntry = (entry: EntryData) => {
    // Make sure the ID of the entry is undefined.
    entry.id = undefined;

    console.log("CREATING ENTRY");

    fetch("/api/entry/create", {
      method: "POST",
      body: JSON.stringify(entry),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw Error(res.statusText);
      })
      .then((res) => {
        console.log("ENTRY CREATED!", res);
        push(`/entry/${res.id}`);
      })
      .catch((err) => {
        toast({
          title: "An error occurred",
          description: "We couldn't save your entry.",
          status: "error",
        });
      });
  };

  return (
    <Page
      title="Create new entry"
      tabTitle="Create entry - 日本語 Grammar Dictionary"
      menu={<DefaultMenu />}
    >
      <Center>
        <Box maxWidth={800}>
          <Box p="5" shadow="md" bg="white" rounded="md">
            <Heading>Add a new entry</Heading>
            <Divider mt="2" mb="2" />
            <EntryEditor onSubmit={createEntry} cancelLink="/" />
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default Create;

// --- SERVER SIDE ---

import nookies from "nookies";
import { firebaseAdmin } from "../../utils/api/firebaseAdmin";
import { EntryData } from "../../types/components/entryData";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    console.log(JSON.stringify(cookies, null, 2));
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
