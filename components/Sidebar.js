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
  onSnapshot,
} from "@firebase/firestore";
import GroupController from "../mixins/group.js";
import MessageController from "../mixins/message";
import UserController from "../mixins/user";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
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

function Sidebar() {
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

    const q = query(
      collection(db, "group"),
      where("members", "array-contains", uid)
    );
    onSnapshot(q, async (snapShot) => {
      getGroupByUid();
    });
  }, []);

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
          if (addedPerson)
            await GroupController.postGroup(uid, addedPerson, "");
          else alert("กรุณาใส่รหัสผู้ใช้");
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
            return <MemoChatList key={index} value={e} />;
          })
        ) : (
          <div />
        )}
      </Flex>
    </Flex>
  );
}
export default memo(Sidebar);

const ChatList = ({ value }) => {
  const router = useRouter();
  const redirect = (id) => {
    router.push(`/chat/${value.id}`);
  };

  return (
    <Flex
      key={Math.random()}
      p={3}
      align="center"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={() => redirect(value.id)}
    >
      <Avatar src={value.otherPerson.photoURL || ""} marginEnd={3} />
      <div style={{ flexDirection: "column" }}>
        <Text>{value.otherPerson.displayName}</Text>
        <Text style={{ fontSize: 12 }}>{value.recentMessage.messageText}</Text>
      </div>
    </Flex>
  );
};
const MemoChatList = memo(ChatList);
