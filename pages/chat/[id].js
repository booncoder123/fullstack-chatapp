import { Flex, Text } from "@chakra-ui/layout";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../firebaseconfig";
import getOtherEmail from "../../utils/getOtherEmail";
import Topbar from "../../components/Topbar";
import Bottombar from "../../components/Bottombar";
import { useRef, useEffect } from "react";
import { useGetMessageByGroupId } from "../../hook/message";
import { useGetGroupById } from "../../hook/group";
import { useState } from "react";
import UserController from "../../mixins/user";
import { async } from "@firebase/util";
import Controller from "../../mixins/custom";
import { Button } from "@chakra-ui/react";
import MessageController from "../../mixins/message";
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

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const getChat = async () => {
      let uid = getCookie("uid");

      onSnapshot(
        collection(db, "message", id, "messages"),
        async (snapShot) => {
          const data = await Controller.getChatPageData(id, uid);
          setData(data);
        }
      );
    };

    getChat();
  }, [router]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  // const [otherUser, setOtherUser] = useState({});
  // let messageList = [];
  // let group = {};
  // let otherId;

  // const [messages, messagesLoading, messagesError] = useGetMessageByGroupId(id);
  // const [groupSnapShot, groupSnapShotLoading, groupSnapShotError] =
  //   useGetGroupById(id);

  // const getOtherUserById = async () => {
  //   const other = await UserController.getUserByUid(otherId);
  //   return other;
  // };

  // if (!messagesLoading && !groupSnapShotLoading) {
  //   messages.docs.forEach((item) => {
  //     messageList.push(item.data());
  //   });
  //   group = groupSnapShot.data();
  //   otherId = group.members.filter((item) => item != user.id).at(0);
  //   console.log(otherId);
  // }

  // const [user] = useAuthState(auth);
  // const [chat] = useDocumentData(doc(db, "chats", id));
  // const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
  // const [messages] = useCollectionData(q);
  // const bottomOfChat = useRef();

  // const getMessages = () =>
  //   messages?.map((msg) => {
  //     const sender = msg.sender === user.email;
  //     return (
  //       <Flex
  //         key={Math.random()}
  //         alignSelf={sender ? "flex-start" : "flex-end"}
  //         bg={sender ? "blue.100" : "green.100"}
  //         w="fit-content"
  //         minWidth="100px"
  //         borderRadius="lg"
  //         p={3}
  //         m={1}
  //       >
  //         <Text>{msg.text}</Text>
  //       </Flex>
  //     );
  //   });

  // useEffect(
  //   () =>
  //     setTimeout(
  //       bottomOfChat.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       }),
  //       100
  //     ),
  //   [messages]
  // );
  // console.log(messageList);

  return (
    <Flex h="100vh">
      <Head>
        <title>Chat App</title>
      </Head>

      <Sidebar />

      <Flex flex={1} direction="column">
        {/* <Topbar email={getOtherEmail(chat?.users, user)} /> */}

        <Flex
          flex={1}
          direction="column"
          pt={4}
          mx={5}
          overflowX="scroll"
          sx={{ scrollbarWidth: "none" }}
        >
          {/* {
            messageList.length > 0 &&
              messageList.map((item, index) => (
                <Bubble key={index} value={item} />
              ))
            <div>{messageList[0].messageText}</div>
          } */}

          {/* {getMessages()} */}
          {/* <div ref={bottomOfChat}></div> */}

          <input
            style={{ padding: 10 }}
            value={input}
            onChange={handleChange}
            placeholder="type message..."
          />
          <Button
            onClick={() => {
              MessageController.postMessage(
                data.group.groupId,
                getCookie("uid"),
                input
              );
            }}
          >
            Click
          </Button>

          {data &&
            data.messages.map((element, index) => (
              <Bubble key={index} value={element} data={data} />
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

const Bubble = ({ value, key, index, data }) => {
  const time = value.message.sentAt;

  return (
    <div
      key={index}
      style={{
        backgroundColor: "grey",
        margin: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      {value.message.messageText}
      <span>
        <br />
        send by
        <span style={{ fontWeight: "bold" }}> {value.user.displayName}</span>
        <br />
        <span style={{ fontSize: 10 }}>
          {value.message.sentAt.toDate().toDateString()}
        </span>
      </span>
    </div>
  );
};
