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
  updateDoc,
} from "@firebase/firestore";
import Group from "../mixins/group.js";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserController from "./user";

export default class GroupController {
  static getGroupByUid = async (uid) => {
    let groups = [];
    const groupRef = collection(db, "group");
    const q = query(groupRef, where("members", "array-contains", uid));
    const querySnapshot = await getDocs(q);

    // for(let item = 0 ; item < querySnapshot.docs)
    // console.log(querySnapshot.docs);
    if (querySnapshot.docs.length) {
      for (const element of querySnapshot.docs) {
        const data = element.data();
        const secPersonId = data.members.filter((pid) => pid != uid).pop();
        const secPersonData = await UserController.getUserByUid(secPersonId);

        groups.push({
          id: element.id,
          ...element.data(),
          otherPerson: secPersonData,
        });
      }
    }

    return groups;
  };
  static getGroupById = async (groupId) => {
    const groupRef = doc(db, "group", groupId);
    const q = query(groupRef);
    const querySnapshot = await getDoc(q);

    return querySnapshot.data();
  };

  static postRecentMessage = async (groupId, recentMessage) => {
    const ref = doc(db, "group", groupId);
    await updateDoc(ref, {
      recentMessage,
    });
  };

  static postGroup = async (uid, otherId, messageText) => {
    try {
      console.log(uid, otherId);
      const groupRef = collection(db, "group");
      const q = query(
        groupRef,
        where("members", "==", [uid, otherId])

        // where("members", "==", otherId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length != 0) {
        console.log("hell");
        alert("ผู้ใช้คนนี้ได้ถูกเพิ่มไปเเล้ว");
        return;
      }

      const obj = {
        members: [uid, otherId],
        name: "",
        type: "private",
        recentMessage: {
          messageText: "",
          sendAt: new Date(),
          sendBy: uid,
        },
      };

      const docRef = await addDoc(collection(db, "group"), obj);
    } catch (error) {
      console.log(error);
    }
  };
}
