import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import styles from "../../styles/[eid].module.css";
import Page from "../../components/Page";
import {
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
import { MdArrowBack, MdModeEdit } from "react-icons/md";
import Descriptor from "../../components/Descriptor/Descriptor";
import DefaultMenu from "../../components/DefaultMenu/DefaultMenu";
import { useAuth } from "../../Providers/AuthProvider";
import ExampleEditable from "../../components/ExampleEditable";
import { useState } from "react";
import { useStringInputHandler, useTextAreaHandler } from "../../hooks/useInputHandler";

const Entry = ({ entry }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [isAddingExample, setIsAddingExample] = useState<boolean>(false);
  const [sentence, sentenceProps] = useStringInputHandler("");
  const [translation, translationProps] = useStringInputHandler("");
  const [explanation, explanationProps] = useTextAreaHandler("");

  const onUpdateExample = (example) => {
    toast({
      title: example.sentence,
      description: "Example has been updated!",
      status: "success",
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
          <Link href={`/entry/${entry.id}/edit`}>
            <Button leftIcon={<MdModeEdit />}>Edit entry</Button>
          </Link>
        )}
      </Flex>

      <div className={styles.cardList}>
        {!isFallback && entry && (
          <VStack spacing="5">
            <Box width="100%" p={5} shadow="md" bg="white" rounded="md">
              <Heading as="h2" size="md" className={styles.cardHeader}>
                {entry.title} {entry.descriptors && <Descriptor text={entry.descriptors} />}
              </Heading>
              <Divider mt="2" mb="2" />
              <Box>{entry.summary}</Box>
            </Box>
            {(user || (entry.examples && entry.examples.length > 0)) && (
              <Box width="100%" p={5} shadow="md" bg="white" rounded="md">
                <Heading as="h2" size="md">
                  Examples
                </Heading>
                <Divider mt="2" mb="4" />
                <VStack spacing="6">
                  {entry.examples.map((exmp) => (
                    <ExampleEditable
                      key={exmp.id}
                      example={exmp}
                      canEdit={!!user}
                      onSubmit={onUpdateExample}
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
                      <VStack mt="10" spacing="2">
                        <Heading width="100%" size="md">
                          Add new example
                        </Heading>
                        <FormControl>
                          <FormLabel>Sentence</FormLabel>
                          <Input type="text" {...sentenceProps} />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Translation</FormLabel>
                          <Input type="text" {...translationProps} />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Explanation</FormLabel>
                          <Textarea {...explanationProps} />
                        </FormControl>
                        <ButtonGroup width="100%" justifyContent="flex-end">
                          <Button colorScheme="green">Add example</Button>
                          <Button colorScheme="red" onClick={() => setIsAddingExample(false)}>
                            Cancel
                          </Button>
                        </ButtonGroup>
                      </VStack>
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
              </HStack>
            </Box>
          </VStack>
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

export const getStaticProps: GetStaticProps = async (context) => {
  const eid = context.params.eid as string;

  const entry = await fetchEntry(eid);

  return {
    props: { entry },
    revalidate: 60 * 10, // Rerender every 10 minutes (upon request).
  };
};
