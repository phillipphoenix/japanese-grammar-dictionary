import { FC } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import Page from "../../../components/Page";
import DefaultMenu from "../../../components/DefaultMenu/DefaultMenu";
import { Box, Center, Divider, Heading, useToast } from "@chakra-ui/react";
import { EntryEditor } from "../../../components/EntryEditor/EntryEditor";

const Edit: FC<{ entry }> = ({ entry }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const toast = useToast();
  const { push, query } = useRouter();
  const { eid } = query;

  console.log("ENTRY", entry);

  /**
   * Submit the create entry form.
   */

  const editEntry = (entry: EntryData) => {
    // Make sure that entry has an ID, as we cannot update without an ID.
    if (!entry.id) {
      console.error("The entry did not have an ID, so we don't know what to update.");
      toast({
        title: "An error occurred",
        description:
          "It was impossible to update the entry. Please refresh the page and try again.",
        status: "error",
      });
      return;
    }

    console.log("EDIT ENTRY");

    fetch(`/api/entry/${entry.id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw Error(res.statusText);
      })
      .then((res) => {
        console.log("ENTRY UPDATED!", res);
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
      title="Edit entry"
      tabTitle="Edit entry - 日本語 Grammar Dictionary"
      menu={<DefaultMenu />}
    >
      <Center>
        <Box maxWidth={800}>
          <Box p="5" shadow="md" bg="white" rounded="md">
            <Heading>Edit existing entry</Heading>
            <Divider mt="2" mb="2" />
            <EntryEditor
              entry={entry}
              submitBtnText="Update"
              onSubmit={editEntry}
              cancelLink={`/entry/${eid}`}
            />
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default Edit;

// --- SERVER SIDE ---

import nookies from "nookies";
import { firebaseAdmin } from "../../../utils/api/firebaseAdmin";
import { EntryData } from "../../../types/components/entryData";
import { fetchEntry } from "../../api/entry/[eid]";

export const getServerSideProps: GetServerSideProps<{ entry: EntryData }> = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    // TODO: If user display name is not set, redirect to user profile and use notification system to display error.

    // the user is authenticated!
    // FETCH STUFF HERE

    const eid = ctx.params.eid as string;

    const entry = await fetchEntry(eid);

    return {
      props: { entry },
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
