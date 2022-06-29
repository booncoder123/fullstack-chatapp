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

const groupRef = collection(db, "group");

export default class UserController {
  static getUserByUid = async (uid) => {
    try {
      const userRef = doc(db, "user", uid);
      const userSnapShot = await getDoc(userRef);

      return userSnapShot.data();
    } catch (error) {
      console.log(error);
    }
  };
  static getDeleteByUid = async (uid) => {
    try {
      const deleteRef = collection(db, "user", uid, "delete");
      let deleteObj = [];
      const deleteSnapShot = await getDocs(deleteRef);
      deleteSnapShot.docs.forEach((item) => {
        deleteObj.push({
          uid: item.id,
          time: item.data(),
        });
      });
      return deleteObj;
    } catch (error) {
      console.log(err);
    }
  };
  static deleteUser = async (uid, duid) => {
    const obj = {
      deleteAt: new Date(),
    };

    await setDoc(doc(db, "user", uid, "delete", duid), obj);
  };
  static postUser = async (uid, displayName) => {
    const obj = {
      displayName,
      uid,
    };

    const ref = doc(db, "user", uid);
    await setDoc(doc(db, "user", uid), obj);
  };
}
