import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import styles from "../../styles/[eid].module.css";
import Page from "../../components/Page";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Divider,
  Editable,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Spacer,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { fetchEntry } from "../api/entry/[eid]";
import { getEntries } from "../api/entries";
import { MdArrowBack, MdDelete, MdModeEdit } from "react-icons/md";
import Descriptor from "../../components/Descriptor/Descriptor";
import DefaultMenu from "../../components/DefaultMenu/DefaultMenu";
import { useAuth } from "../../Providers/AuthProvider";
import ExampleEditable from "../../components/ExampleEditable";
import { useStringInputHandler, useTextAreaHandler } from "../../hooks/useInputHandler";
import { EntryData } from "../../types/components/entryData";
import { ExampleData } from "../../types/components/exampleData";
import { getNotificationQueryParams } from "../../utils/notificationUtils";
import { useFurigana } from "../../hooks/useFurigana";

const Entry = ({ entry }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback, push } = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [examples, setExamples] = useState<ExampleData[]>(entry?.examples || []);

  const [convertFurigana] = useFurigana();

  // Delete alert box.
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onAlertClose = () => setIsAlertOpen(false);
  const cancelAlertRef = useRef();

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

    return fetch(`/api/entry/${entry.id}`, {
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
        toast({
          title: "やった!",
          description: "The entry was updated successfully!",
          status: "success",
        });
        return res;
      })
      .catch((err) => {
        toast({
          title: "ごめん",
          description: "We couldn't save your entry.",
          status: "error",
        });
      });
  };

  /**
   * Delete the entry with the given ID.
   */
  const deleteEntry = (entryId: string) => {
    // Make sure that entry has an ID, as we cannot update without an ID.
    if (!entryId) {
      console.error("No ID for the entry to delete given. Can't delete unknown entry.");
      toast({
        title: "An error occurred",
        description: "Something went wrong, while deleting the entry...",
        status: "error",
      });
      return;
    }

    return fetch(`/api/entry/${entry.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw Error(res.statusText);
      })
      .then((res) => {
        const notificationParams = getNotificationQueryParams({
          title: "やった!",
          description: "The entry was successfully deleted!",
          status: "success",
        });
        push(`/${notificationParams}`);
      })
      .catch((err) => {
        toast({
          title: "ごめん",
          description: "An error occurred, while trying to delete the entry.",
          status: "error",
        });
      });
  };

  // --- Adding new example ---
  const [isAddingExample, setIsAddingExample] = useState<boolean>(false);
  const [sentence, sentenceProps, setSentence] = useStringInputHandler("");
  const [translation, translationProps, setTranslation] = useStringInputHandler("");
  const [explanation, explanationProps, setExplanation] = useTextAreaHandler("");

  const onCreateExample = () => {
    // Submit entry with updated examples.
    const newExample: ExampleData = { sentence, translation, explanation };
    const updatedExamples: ExampleData[] = [...examples, newExample];
    editEntry({ ...entry, examples: updatedExamples }).then((updatedEntry) => {
      setExamples(updatedEntry.examples);
      // Close drawer.
      setIsAddingExample(false);
      // Clear inputs.
      setSentence("");
      setTranslation("");
      setExplanation("");
    });
  };

  const onEditExample = (example: ExampleData, index: number) => {
    // Submit entry with updated examples.
    const updatedExamples = [...examples];
    updatedExamples[index] = example;
    editEntry({ ...entry, examples: updatedExamples }).then((updatedEntry) => {
      setExamples(updatedEntry.examples);
    });
  };

  const onDeleteExample = (index: number) => {
    // Submit entry with updated examples.
    const updatedExamples = [...examples];
    updatedExamples.splice(index, 1);
    editEntry({ ...entry, examples: updatedExamples }).then((updatedEntry) => {
      setExamples(updatedEntry.examples);
    });
  };

  // Formatter used to correctly display the dates.
  const dateFormatter = new Intl.DateTimeFormat("da");

  return (
    <Page title="日本語 Grammar Entry" tabTitle="Entry: eid" menu={<DefaultMenu />}>
      <Flex>
        <Link href="/">
          <Button leftIcon={<MdArrowBack />}>Back</Button>
        </Link>
        <Spacer />
        {user && (
          <ButtonGroup spacing="2">
            <Link href={`/entry/${entry.id}/edit`}>
              <Button leftIcon={<MdModeEdit />}>Edit entry</Button>
            </Link>
            <Button colorScheme="red" leftIcon={<MdDelete />} onClick={() => setIsAlertOpen(true)}>
              Delete entry
            </Button>
          </ButtonGroup>
        )}
      </Flex>

      <div className={styles.cardList}>
        {!isFallback && entry && (
          <>
            <VStack spacing="5">
              <Box width="100%" p={5} shadow="md" bg="white" rounded="md">
                <Heading as="h2" size="md" className={styles.cardHeader}>
                  <span dangerouslySetInnerHTML={{ __html: convertFurigana(entry.title) }}></span>{" "}
                  {entry.descriptors && <Descriptor text={entry.descriptors} />}
                </Heading>
                <Divider mt="2" mb="2" />
                <Box
                  dangerouslySetInnerHTML={{
                    __html: convertFurigana(entry.description || entry.summary),
                  }}
                ></Box>
              </Box>
              {(user || (entry.examples && entry.examples.length > 0)) && (
                <Box width="100%" p={5} shadow="md" bg="white" rounded="md">
                  <Heading as="h2" size="md">
                    Examples
                  </Heading>
                  <Divider mt="2" mb="4" />
                  <VStack spacing="6">
                    {examples.map((exmp, index) => (
                      <ExampleEditable
                        key={index}
                        example={exmp}
                        canEdit={!!user}
                        onSubmit={(updatedExmp) => onEditExample(updatedExmp, index)}
                        onDelete={() => onDeleteExample(index)}
                      />
                    ))}
                  </VStack>
                  {user && (
                    <>
                      <Collapse in={!isAddingExample}>
                        <ButtonGroup width="100%" justifyContent="flex-end">
                          <Button onClick={() => setIsAddingExample(true)}>Add new example</Button>
                        </ButtonGroup>
                      </Collapse>
                      <Collapse in={isAddingExample}>
                        <form
                          onSubmit={(evt) => {
                            evt.preventDefault();
                            onCreateExample();
                          }}
                        >
                          <VStack mt="10" spacing="2">
                            <Heading width="100%" size="md">
                              Add new example
                            </Heading>
                            <FormControl isRequired>
                              <FormLabel>Sentence</FormLabel>
                              <Input type="text" {...sentenceProps} />
                            </FormControl>
                            <FormControl isRequired>
                              <FormLabel>Translation</FormLabel>
                              <Input type="text" {...translationProps} />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Explanation</FormLabel>
                              <Textarea {...explanationProps} />
                            </FormControl>
                            <ButtonGroup width="100%" justifyContent="flex-end">
                              <Button type="submit" colorScheme="green">
                                Add example
                              </Button>
                              <Button colorScheme="red" onClick={() => setIsAddingExample(false)}>
                                Cancel
                              </Button>
                            </ButtonGroup>
                          </VStack>
                        </form>
                      </Collapse>
                    </>
                  )}
                </Box>
              )}
              <Box width="100%">
                <HStack
                  spacing="2"
                  divider={
                    <Center height="30px">
                      <Divider orientation="vertical" />
                    </Center>
                  }
                >
                  {entry.createdAt && (
                    <Text fontSize="sm">
                      Created: {dateFormatter.format(new Date(entry.createdAt))}
                    </Text>
                  )}
                  {entry.updatedAt && (
                    <Text fontSize="sm">
                      Last updated: {dateFormatter.format(new Date(entry.updatedAt))}
                    </Text>
                  )}
                  {entry.updatedBy && <Text fontSize="sm">Updated by: {entry.updatedBy}</Text>}
                </HStack>
              </Box>
            </VStack>
            <AlertDialog
              isOpen={isAlertOpen}
              leastDestructiveRef={cancelAlertRef}
              onClose={onAlertClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Entry?
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    <Text>Are you sure you want to delete the following entry?</Text>
                    <Divider mt="2" mb="2" />
                    <Text fontWeight="bold">
                      {entry.title} {entry.descriptors && <Descriptor text={entry.descriptors} />}
                    </Text>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <ButtonGroup spacing={3}>
                      <Button ref={cancelAlertRef} onClick={onAlertClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={() => deleteEntry(entry.id)}>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </div>
    </Page>
  );
};

export default Entry;

// Server side render and cache content.
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getEntries();

  const paths = entries.map((entry) => ({ params: { eid: entry.id } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<{ entry: EntryData }> = async (context) => {
  const eid = context.params.eid as string;

  const entry = await fetchEntry(eid);

  return {
    props: { entry },
    revalidate: 1, // Rerender every 1 seconds (upon request).
  };
};
