import { FC, useCallback, useState } from "react";
import Link from "next/link";
import { EntryData } from "../../types/components/entryData";
import { useStringInputHandler } from "../../hooks/useInputHandler";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Descriptor from "../../components/Descriptor/Descriptor";
import { MdAdd } from "react-icons/md";

interface EntryEditorProps {
  entry?: EntryData;
  onSubmit: (values: EntryData) => void;
  cancelLink?: string;
  cancelFunc?: () => void;
}

export const EntryEditor: FC<EntryEditorProps> = ({ entry, onSubmit, cancelLink, cancelFunc }) => {
  // --- INPUT VALIDATION ---
  if (!!cancelLink && !!cancelFunc) {
    console.error(
      "It is not possible to have both a cancel link and a cancel function. Please only use one of them."
    );
  }

  // --- STATE MANAGEMENT ---

  const titleParts = entry?.title?.split(" - ") || null;

  const [titleJp, titleJpProps] = useStringInputHandler(
    titleParts && titleParts.length > 0 ? titleParts[0] : ""
  );
  const [titleEn, titleEnProps] = useStringInputHandler(
    titleParts && titleParts.length > 1 ? titleParts[1] : ""
  );
  const [descriptors, descriptorsProps] = useStringInputHandler(entry?.descriptors || "");
  const [description, setDescription] = useState<string>(entry?.summary || "");
  const [tag, tagProps, setTag] = useStringInputHandler("");

  const tagsParts = entry?.tags?.split(",");
  const [tags, setTags] = useState<string[]>(tagsParts || []);

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

  // --- SUBMITTING DATA ---

  const createEntryObj = useCallback(() => {
    const tagStr = [titleJp, titleEn, descriptors, ...tags].join(",");

    const entryData: EntryData = {
      title: `${titleJp} - ${titleEn}`,
      descriptors,
      summary: description,
      tags: tagStr,
      examples: entry?.examples || [],
    };

    return entryData;
  }, [titleJp, titleEn, descriptors, description, tags]);

  // --- COMPONENT STRUCTURE ---

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        const entryObj = createEntryObj();
        console.log("CALLING ON SUBMIT WITH", entryObj);
        onSubmit(entryObj);
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
            The English part of the title of the entry. Should explain the entry in as few words as
            possible.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Descriptors</FormLabel>
          <Input type="text" placeholder="sentence ending expression" {...descriptorsProps} />
          <FormHelperText>
            A small text displayed after the title to indicate the type of entry, for instance if it
            is an expression, a sentence ending expression or a particle.
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
            A description that explains the entry and how to use it. The explanation should not
            include full example sentences as they are added separately.
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
            Tags automatically includes the japanese and the english title parts and the descriptor,
            but you might want to add other things here to.
            <br />
            Add romaji versions of titles and other japanese text that you want to be able to search
            for using romaji.
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
          {cancelLink && !cancelFunc && (
            <Link href={cancelLink}>
              <Button colorScheme="red">Cancel</Button>
            </Link>
          )}
          {!cancelLink && cancelFunc && (
            <Button colorScheme="red" onClick={cancelFunc}>
              Cancel
            </Button>
          )}
        </HStack>
      </Flex>
    </form>
  );
};
