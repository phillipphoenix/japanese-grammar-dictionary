import { FC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import firebase from "firebase";
import { useAuth } from "../../Providers/AuthProvider";
import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { MdAdd, MdMenu, MdPerson } from "react-icons/md";

interface DefaultMenuProps {
  /**
   * If no logout destination is given, the page will reload on logout.
   */
  logoutDestination?: string;
}

const DefaultMenu: FC<DefaultMenuProps> = ({ logoutDestination }) => {
  const { user } = useAuth();
  const { reload, push } = useRouter();

  const onLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        if (!!logoutDestination) {
          push(logoutDestination);
        } else {
          reload();
        }
      });
  };

  return (
    <Menu>
      <MenuButton
        background="white"
        as={IconButton}
        aria-label="Options"
        icon={<Icon as={MdMenu} />}
        size="sm"
      />
      <MenuList>
        {user && (
          <>
            <MenuItem icon={<Icon as={MdAdd} />}>Create new entry</MenuItem>
            <Link href="/userProfile">
              <MenuItem icon={<Icon as={MdPerson} />}>User profile</MenuItem>
            </Link>
            <MenuItem onClick={onLogOut}>Log out</MenuItem>
          </>
        )}
        {!user && (
          <>
            <Link href="/login">
              <MenuItem>Log in</MenuItem>
            </Link>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default DefaultMenu;
