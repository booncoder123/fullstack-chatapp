import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
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

import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";

function fetchGroupByUserID(uid) {
  // return new Promise((resolve, reject) => {
  //   const groupRef = db.collection("group");
  //   groupRef
  //     .where("members", "array-contains", uid)
  //     .onSnapshot((querySnapshot) => {
  //       const allGroups = [];
  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data();
  //         data.id = doc.id;
  //         if (data.recentMessage) allGroups.push(data);
  //       });
  //       vm.groups = allGroups;
  //     });
  // });
}

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const chats = fetchGroupByUserID(user.uid);
  // const [groupSnapshot, groupLoading, groupError] = useCollection(
  //   collection(db, "group")
  // );
  // const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const router = useRouter();
  const groupRef = collection(db, "group");
  // const messageRed = collection(db, "message");

  const getGroupByUid = async (uid) => {
    const q = query(groupRef, where("members", "array-contains", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  };

  const getMessageByGroupId = async (groupId) => {
    const messageRef = collection(db, "message", groupId, "messages");
    const q = query(messageRef, orderBy("sentAt"));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  };

  // if (!groupLoading) {
  // const getMessagesByGroupId = async () => {
  //   const groupIds = await getGroupIdByUid(user.uid);
  //   let messages = [];
  //   for (let i = 0; i < groupIds.length; i++) {
  //     const messageSnapshot = await getMessageByGroupId(groupIds[i]);
  //     console.log({ messageSnapshot });
  //   }
  // };
  // console.log(getMessagesByGroupId());

  // getMessageByGroupId("CSxfctQL4R2HauwspNUs");

  // }

  // console.log({ chats });
  // console.log(snapshot?.docs);
  // const [users, usersLoading, userError] = useCollection(
  //   collection(db, "user"),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  // const [group, groupLoading, groupError] = useCollection(
  //   collection(db, "group"),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );

  // if (!usersLoading && !groupLoading) {
  // console.log("users", users.docs[1].data());
  // console.log("group", group.size);
  // console.log("group", group);
  // }

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

  // const chatList = async () => {
  //   const groups = await getGroupByUid(user.uid);
  //   // return [1, 2, 3, 4].map((group) => {
  //   // <Flex
  //   //   key={Math.random()}
  //   //   p={3}
  //   //   align="center"
  //   //   _hover={{ bg: "gray.100", cursor: "pointer" }}
  //   //   // onClick={() => redirect(chat.id)}
  //   // >
  //   //   <Avatar src="" marginEnd={3} />
  //   //   {/* <Text>{getOtherEmail(chat.users, user)}</Text> */}
  //   // </Flex>;
  //   // });
  //   return groups;
  // };

  const chatList = async () => {
    const groups = await getGroupByUid(user.uid);

    return (
      <div>
        {groups.docs.map((chat) => (
          <Flex
            key={Math.random()}
            p={3}
            align="center"
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            onClick={() => redirect(chat.id)}
          >
            <Avatar src="" marginEnd={3} />
            {/* <Text>{getOtherEmail(chat.users, user)}</Text> */}
          </Flex>
        ))}
      </div>
    );
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
        {/* {chatList()} */}
      </Flex>
    </Flex>
  );
}
