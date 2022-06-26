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
import Group from "../mixins/group.js";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GroupController from "../mixins/group.js";
import UserController from "./user";

export default class MessageController {
  static getMessageByGroupId = async (groupId) => {
    let messages = [];
    const messageRef = collection(db, "message", groupId, "messages");
    const q = query(messageRef, orderBy("sentAt"));

    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((item) => {
    //   messages.push(item.data());
    // });

    for (const item of querySnapshot.docs) {
      const messageData = item.data();
      const user = await UserController.getUserByUid(messageData.sentBy);

      messages.push({
        message: item.data(),
        user,
      });
    }

    return messages;
  };

  static postMessage = async (groupId, senderId, messageText) => {
    const obj = {
      messageText: messageText,
      sentAt: new Date(),
      sentBy: senderId,
    };
    await addDoc(collection(db, "message", groupId, "messages"), obj);
  };
}
