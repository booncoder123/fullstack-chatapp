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
import MessageController from "./message";
import { async } from "@firebase/util";
const groupRef = collection(db, "group");

export default class Controller {
  static getChatPageData = async (groupId, userId) => {
    const group = await GroupController.getGroupById(groupId);
    const messageList = await MessageController.getMessageByGroupId(groupId);

    return {
      group: {
        ...group,
        groupId,
      },
      messages: messageList,
    };
  };

  static getGroupListPage = async (userId) => {
    let groups = [];
    const group = await GroupController.getGroupByUid(userId);

    group.docs.forEach((i) => groups.push(i.data()));
    return {
      group: {
        groups,
      },
    };
  };
}
