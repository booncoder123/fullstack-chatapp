import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/react";
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

export default function Sidebar() {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [groupList, setGroupList] = useState([]);

  const [value, loading, error] = useCollection(
    collection(
      db,
      "message",
      "CSxfctQL4R2HauwspNUs",
      "message"
      // "5ykHsywBoUs3wzzJOnOV"
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  console.log({ value });

  const eiei = async function () {
    const groups = await GroupController.getGroupByUid(user.uid);
    setGroupList(groups.docs.map((e) => e.data()));
  };

  useEffect(() => {
    eiei();
  }, []);

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
        {groupList.map((e, index) => (
          <ChatList key={index} value={e} />
        ))}

        {}
      </Flex>
    </Flex>
  );
}

const ChatList = ({ value }) => {
  const [otherUser, setOtherUser] = useState(null);
  const [user] = useAuthState(auth);
  const setChatList = async () => {
    // setOtherUser(
    //   UserController.getUserByUid(value.members.slice(user.uid, 1).at(0)).data()
    // );
    // if (otherUser) {
    //   console.log(otherUser);
    // }
  };

  useEffect(() => {
    setChatList();
  }, []);

  return (
    <Flex
      key={Math.random()}
      p={3}
      align="center"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={() => redirect(chat.id)}
    >
      <Avatar src="" marginEnd={3} />
      {/* <Text>{e}</Text> */}

      {/* <Text>{getOtherEmail(chat.users, user)}</Text> */}
    </Flex>
  );
};
