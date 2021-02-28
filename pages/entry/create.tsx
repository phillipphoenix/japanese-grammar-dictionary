import { FC, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useStringInputHandler } from "../../hooks/useInputHandler";
import Page from "../../components/Page";
import DefaultMenu from "../../components/DefaultMenu/DefaultMenu";
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
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Descriptor from "../../components/Descriptor/Descriptor";
import { MdAdd } from "react-icons/md";

const Create: FC = () => {
  const toast = useToast();
  const { push } = useRouter();
  const [titleJp, titleJpProps] = useStringInputHandler("");
  const [titleEn, titleEnProps] = useStringInputHandler("");
  const [descriptors, descriptorsProps] = useStringInputHandler("");
  const [description, setDescription] = useState<string>("");
  const [tag, tagProps, setTag] = useStringInputHandler("");

  const [tags, setTags] = useState<string[]>([]);

  /**
   * Submit the create entry form.
   */
  const createEntry = useCallback(() => {
    const tagStr = [titleJp, titleEn, descriptors, ...tags].join(",");

    const body = {
      title: `${titleJp} - ${titleEn}`,
      descriptors,
      description,
      tags: tagStr,
    };

    fetch("/api/entry/create", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw Error(res.statusText);
      })
      .then((res) => {
        push(`/entry/${res.id}`);
      })
      .catch((err) => {
        toast({
          title: "An error occurred",
          description: "We couldn't save your entry.",
          status: "error",
        });
      });
  }, [titleJp, titleEn, descriptors, description, tags]);

  /**
   * Add the tag in the tag field to the list of tags.
   */
  const addTag = useCallback(() => {
    const trimmedTag = tag.trim();
    if (!!trimmedTag) {
      pushTag(trimmedTag);
      setTag("");
    }
  }, [tag]);

  /**
   * Push a tag into the array of tags.
   */
  const pushTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!!trimmedTag && !tags.includes(trimmedTag)) {
        setTags((existingTags) => [...existingTags, trimmedTag]);
      }
    },
    [tags]
  );

  /**
   * Remove a tag from the list of tags.
   */
  const removeTag = useCallback(
    (tag) => {
      setTags((existingTags) => [...existingTags.filter((curTag) => curTag !== tag)]);
    },
    [tags]
  );

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
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                createEntry();
              }}
            >
              <VStack spacing={2}>
                <FormControl isRequired>
                  <FormLabel>Title Japanese</FormLabel>
                  <Input type="text" placeholder="V(plain)ようになる" {...titleJpProps} />
                  <FormHelperText>
                    The Japanese part of the title of the entry. Use for instance V(conjugation) or
                    A(conjugation) to indicate a specific verb/adjective conjugation in the entry.
                  </FormHelperText>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Title English</FormLabel>
                  <Input type="text" placeholder="a change has taken place" {...titleEnProps} />
                  <FormHelperText>
                    The English part of the title of the entry. Should explain the entry in as few
                    words as possible.
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Descriptors</FormLabel>
                  <Input
                    type="text"
                    placeholder="sentence ending expression"
                    {...descriptorsProps}
                  />
                  <FormHelperText>
                    A small text displayed after the title to indicate the type of entry, for
                    instance if it is an expression, a sentence ending expression or a particle.
                  </FormHelperText>
                </FormControl>
                <Box width="100%">
                  <FormLabel>Title preview</FormLabel>
                  <Text>
                    {titleJp} - {titleEn} <Descriptor text={descriptors} />
                  </Text>
                </Box>
                <Divider mt="2" mb="2" />
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Makes a sentence into a noun. Can then be followed by for instance the は (ha) particle."
                    value={description}
                    onChange={(evt) => setDescription(evt.currentTarget.value)}
                  />
                  <FormHelperText>
                    A description that explains the entry and how to use it. The explanation should
                    not include full example sentences as they are added separately.
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <InputGroup>
                    <Input
                      {...tagProps}
                      onKeyDown={(evt) => {
                        if (evt.key === "Enter") {
                          evt.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <InputRightAddon>
                      <Button onClick={addTag}>Add tag</Button>
                    </InputRightAddon>
                  </InputGroup>
                  <FormHelperText>
                    Tags are used for searching for the entry.
                    <br />
                    Tags automatically includes the japanese and the english title parts and the
                    descriptor, but you might want to add other things here to.
                    <br />
                    Add romaji versions of titles and other japanese text that you want to be able
                    to search for using romaji.
                  </FormHelperText>
                </FormControl>
                <Wrap width="100%" spacing={2}>
                  {titleJp && (
                    <WrapItem>
                      <Tag>
                        <TagLabel color="gray.400">{titleJp}</TagLabel>
                      </Tag>
                    </WrapItem>
                  )}
                  {titleEn && (
                    <WrapItem>
                      <Tag>
                        <TagLabel color="gray.400">{titleEn}</TagLabel>
                      </Tag>
                    </WrapItem>
                  )}
                  {descriptors && (
                    <WrapItem>
                      <Tag>
                        <TagLabel color="gray.400">{descriptors}</TagLabel>
                      </Tag>
                    </WrapItem>
                  )}
                  {tags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag>
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={(evt) => removeTag(tag)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </VStack>
              <Divider mt="2" mb="2" />
              <Flex mt="2">
                <Spacer />
                <HStack spacing={2}>
                  <Button type="submit" colorScheme="green" leftIcon={<Icon as={MdAdd} />}>
                    Create
                  </Button>
                  <Link href="/">
                    <Button colorScheme="red">Cancel</Button>
                  </Link>
                </HStack>
              </Flex>
            </form>
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
