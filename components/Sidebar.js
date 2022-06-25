import { Avatar } from "@chakra-ui/avatar";
import { Button, InputGroup } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
} from "@firebase/firestore";
import GroupController from "../mixins/group.js";
import MessageController from "../mixins/message";
import UserController from "../mixins/user";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { useCollection } from "react-firebase-hooks/firestore";
import { useGetGroupByUid } from "../hook/group";
import { useGetUserByUid } from "../hook/user";

export default function Sidebar() {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [groups, groupsLoading, groupsError] = useGetGroupByUid(user.uid);
  if (!groupsLoading) {
    let listItem = [];
    const result = groups.docs.map((item) => {
      listItem.push(item.data());
    });
    console.log(listItem);
  }

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };

  const chatExists = (email) =>
    chats?.find(
      (chat) => chat.users.includes(user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const input = prompt("Enter email of chat recipient");
    if (!chatExists(input) && input != user.email) {
      await addDoc(collection(db, "chats"), { users: [user.email, input] });
    }
  };

  return (
    <Flex
      // bg="blue.100"
      h="100%"
      w="300px"
      borderEnd="1px solid"
      borderColor="gray.200"
      direction="column"
    >
      <Flex
        // bg="red.100"
        h="81px"
        w="100%"
        align="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="gray.200"
        p={3}
      >
        <Flex align="center">
          <Avatar src={user.photoURL} marginEnd={3} />
          <Text>{user.displayName}</Text>
        </Flex>

        <IconButton
          size="sm"
          isRound
          icon={<ArrowLeftIcon />}
          onClick={() => signOut(auth)}
        />
      </Flex>

      <Button m={5} p={4} onClick={() => newChat()}>
        New Chat
      </Button>

      <Flex
        overflowX="scroll"
        direction="column"
        sx={{ scrollbarWidth: "none" }}
        flex={1}
      >
        {!groupsLoading &&
          groups.docs.map((e, index) => (
            <ChatList key={index} value={e.data()} />
          ))}
      </Flex>
    </Flex>
  );
}

const ChatList = ({ value }) => {
  const [user] = useAuthState(auth);
  const [otherUser, otherUserLoading, otherUserError] = useGetUserByUid(
    value.members.filter((value) => value != user.uid).at(0)
  );
  const { photoURL } = !otherUserLoading ? otherUser.data() : {};

  return (
    <Flex
      key={Math.random()}
      p={3}
      align="center"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      // onClick={() => redirect(chat.id)}
    >
      <Avatar src={photoURL || ""} marginEnd={3} />
      <Text>{value.recentMessage ? value.recentMessage.messageText : ""}</Text>
    </Flex>
  );
};
