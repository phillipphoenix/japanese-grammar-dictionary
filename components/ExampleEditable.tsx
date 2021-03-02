import { FC } from "react";
import {
  Box,
  ButtonGroup,
  chakra,
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

export interface ExampleEditableProps {
  example: {
    [key: string]: string;
  };
  canEdit: boolean;
  onSubmit: (example) => void;
}

const ExampleEditable: FC<ExampleEditableProps> = ({ example, canEdit, onSubmit }) => {
  const [sentence, sentenceProps] = useStringInputHandler(example.sentence);
  const [translation, translationProps] = useStringInputHandler(example.translation);
  const [explanation, explanationProps] = useTextAreaHandler(example.explanation);

  const submitChanges = () => {
    const updatedExample = {
      ...example,
      sentence,
      translation,
      explanation,
    };

    onSubmit(updatedExample);
  };

  return (
    <Editable
      key={example.id}
      width="100%"
      isPreviewFocusable={false}
      submitOnBlur={false}
      onSubmit={submitChanges}
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
  );
};

export default ExampleEditable;
