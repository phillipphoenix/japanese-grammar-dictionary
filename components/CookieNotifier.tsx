import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Button, ButtonGroup, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { parseCookies, setCookie } from "nookies";
import { FC, useEffect } from "react";

const CookieNotifier: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const cookies = parseCookies();
    const cookiesAccepted = cookies.cookiesAccepted && cookies.cookiesAccepted === "true";
    if (!cookiesAccepted) {
      onOpen();
    }
  }, []);

  const onAcceptCookies = () => {
    onClose();
    setCookie(null, "cookiesAccepted", "true");
  };

  return (
    <>
      <Drawer
        placement="bottom"
        onClose={onClose}
        isOpen={isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader textAlign="center" borderBottomWidth="1px">
              We are using 🍪 cookies!
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing="2">
                <Text>Cookies are used for features like login for editors.</Text>
                <Text>This means that cookies will be saved, when you log in.</Text>
                <ButtonGroup size="sm">
                  <Button colorScheme="green" onClick={onAcceptCookies}>
                    I understand
                  </Button>
                </ButtonGroup>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default CookieNotifier;
