import { FC, useEffect, useRef, useState } from "react";
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
  Divider,
  Editable,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Spacer,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { MdCheck, MdClose, MdDelete, MdModeEdit } from "react-icons/md";
import { useStringInputHandler, useTextAreaHandler } from "../hooks/useInputHandler";
import { ExampleData } from "../types/components/exampleData";

export interface ExampleEditableProps {
  example: ExampleData;
  canEdit: boolean;
  onSubmit: (example) => void;
  onDelete: (example) => void;
}

const ExampleEditable: FC<ExampleEditableProps> = ({ example, canEdit, onSubmit, onDelete }) => {
  const [sentence, sentenceProps, setSentence] = useStringInputHandler(example.sentence);
  const [translation, translationProps, setTranslation] = useStringInputHandler(
    example.translation
  );
  const [explanation, explanationProps, setExplanation] = useTextAreaHandler(example.explanation);

  // Delete alert box.
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onAlertClose = () => setIsAlertOpen(false);
  const cancelAlertRef = useRef();

  useEffect(() => {
    setSentence(example.sentence);
    setTranslation(example.translation);
    setExplanation(example.explanation);
  }, [example]);

  const submitChanges = () => {
    const updatedExample = {
      ...example,
      sentence,
      translation,
      explanation,
    };

    onSubmit(updatedExample);
  };

  const onCancel = () => {
    setSentence(example.sentence);
    setTranslation(example.translation);
    setExplanation(example.explanation);
  };

  const onDeleteConfirmed = () => {
    setIsAlertOpen(false);
    onDelete(example);
  };

  return (
    <>
      <Editable
        width="100%"
        isPreviewFocusable={false}
        submitOnBlur={false}
        onSubmit={submitChanges}
        onCancel={onCancel}
      >
        {(props) => (
          <>
            <Flex>
              <Box flexGrow={1}>
                {!props.isEditing ? (
                  <>
                    <Text fontWeight="bold">{sentence}</Text>
                    <Text>{example.translation}</Text>
                    {example.explanation && (
                      <Text mt="2" fontStyle="italic">
                        {example.explanation}
                      </Text>
                    )}
                  </>
                ) : (
                  <VStack spacing="2">
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
                  </VStack>
                )}
              </Box>
              {canEdit && (
                <>
                  <Spacer />
                  <Box ml="5">
                    {!props.isEditing ? (
                      <ButtonGroup size="sm" isAttached>
                        <IconButton
                          aria-label="Edit example"
                          icon={<MdModeEdit />}
                          onClick={props.onEdit}
                        />
                        <IconButton
                          aria-label="Remove example"
                          colorScheme="red"
                          icon={<MdDelete />}
                          onClick={() => setIsAlertOpen(true)}
                        />
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup size="sm" isAttached>
                        <IconButton
                          aria-label="Save edits"
                          colorScheme="green"
                          icon={<MdCheck />}
                          onClick={props.onSubmit}
                        />
                        <IconButton
                          aria-label="Cancel edits"
                          colorScheme="red"
                          icon={<MdClose />}
                          onClick={props.onCancel}
                        />
                      </ButtonGroup>
                    )}
                  </Box>
                </>
              )}
            </Flex>
          </>
        )}
      </Editable>
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelAlertRef} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Example?
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>Are you sure you want to delete the following example?</Text>
              <Divider mt="2" mb="2" />
              <Text fontWeight="bold">{sentence}</Text>
              <Text>{example.translation}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup spacing={3}>
                <Button ref={cancelAlertRef} onClick={onAlertClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onDeleteConfirmed}>
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ExampleEditable;
