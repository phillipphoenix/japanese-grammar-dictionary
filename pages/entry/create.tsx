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
        const notificationParams = getNotificationQueryParams({
          title: "すごい!",
          description: "You've successfully created an entry!",
          status: "success",
        });
        push(`/entry/${res.id}${notificationParams}`);
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
            <EntryEditor submitBtnText="Create" onSubmit={createEntry} cancelLink="/" />
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
import { getNotificationQueryParams } from "../../utils/notificationUtils";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, name } = token;

    // If no display name set, redirect as we like users to have a display name, before creating / editing content.
    if (!name) {
      const notificationParams = getNotificationQueryParams({
        title: "Missing display name",
        description: "A display name is required before creating or editing content.",
      });
      return {
        redirect: {
          permanent: false,
          destination: `/userProfile${notificationParams}`,
        },
        props: {} as never,
      };
    }

    // TODO: If user display name is not set, redirect to user profile and use notification system to display error.

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
