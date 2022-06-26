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

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [groups, setGroups] = useState([]);
  const [addedPerson, setAddedPerson] = useState("");
  let uid = getCookie("uid");

  const handleChange = (event) => {
    setAddedPerson(event.target.value);
  };

  useEffect(() => {
    const getGroupByUid = async () => {
      let uid = getCookie("uid");
      const data = await GroupController.getGroupByUid(uid);

      setGroups(data);
    };

    getGroupByUid();
  }, []);

  // const [groups, groupsLoading, groupsError] = useGetGroupByUid(user.uid);
  // if (!groupsLoading) {
  //   let listItem = [];
  //   const result = groups.docs.map((item) => {
  //     listItem.push(item.data());
  //   });
  //   console.log(listItem);
  // }

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
          // onClick={() => signOut(auth)}
        />
      </Flex>
      <input
        placeholder="Put other people uid here..."
        style={{ padding: 10 }}
        value={addedPerson}
        onChange={handleChange}
      />
      <Button
        onClick={async () => {
          await GroupController.postGroup(uid, addedPerson, "");
        }}
      >
        ADD
      </Button>

      {/* <Button m={5} p={4} onClick={() => newChat()}>
        New Chat
      </Button> */}

      <Flex
        overflowX="scroll"
        direction="column"
        sx={{ scrollbarWidth: "none" }}
        flex={1}
      >
        {groups.length ? (
          groups.map((e, index) => {
            return <ChatList key={index} value={e} />;
          })
        ) : (
          <div />
        )}
      </Flex>
    </Flex>
  );
}

const ChatList = ({ value }) => {
  // const [user] = useAuthState(auth);

  // const [otherUser, otherUserLoading, otherUserError] = useGetUserByUid(
  //   value.members.filter((value) => value != user.uid).at(0)
  // );
  // const { photoURL } = !otherUserLoading ? otherUser.data() : {};

  const router = useRouter();

  const redirect = (id) => {
    router.push(`/chat/${value.id}`);
  };

  return (
    <Flex
      // key={Math.random()}
      p={3}
      align="center"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={() => redirect("12")}
    >
      <Avatar src={value.otherPerson.photoURL || ""} marginEnd={3} />
      <Text>{value.otherPerson.displayName}</Text>
      <Text>{value.recentMessage.messageText}</Text>
    </Flex>
  );
};
