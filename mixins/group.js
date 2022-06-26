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

  static postRecentMessage = async (groupId, obj) => {
    // console.log(groupId, obj);
    // await addDoc(collection(db, "group", groupId, "recentMessage"), obj);
    // await setDoc(doc(db, "group", groupId, "recentMessage"), obj);
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

  // const useGetGroupById = (groupId) =>
  // useDocument(query(doc(db, "group", groupId)), {
  //   snapshotListenOptions: { includeMetadataChanges: true },
  // });

  // static filterGroup(userArray) {
  //   return new Promise((resolve, reject) => {
  //     let groupRef = db.collection("group");
  //     userArray.forEach((userId) => {
  //       groupRef = groupRef.where("members", "==", userId);
  //     });
  //     groupRef
  //       .get()
  //       .then(function (querySnapshot) {
  //         const allGroups = [];
  //         querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           data.id = doc.id;
  //           allGroups.push(data);
  //         });
  //         if (allGroups.length > 0) {
  //           resolve(allGroups[0]);
  //         } else {
  //           resolve(null);
  //         }
  //       })
  //       .catch(function (error) {
  //         reject(error);
  //       });
  //   });
  // }
  // static fetchGroupByUserID(uid) {
  //   return new Promise((resolve, reject) => {
  //     const groupRef = db.collection("group");
  //     groupRef
  //       .where("members", "array-contains", uid)
  //       .onSnapshot((querySnapshot) => {
  //         const allGroups = [];
  //         querySnapshot.forEach((doc) => {
  //           const data = doc.data();
  //           data.id = doc.id;
  //           if (data.recentMessage) allGroups.push(data);
  //         });
  //         vm.groups = allGroups;
  //       });
  //   });
  // }
  // static fetchGroupByIds(groupIds) {
  //   const groups = [];
  //   const groupRef = db.collection("group");
  //   groupIds.forEach(async (groupId) => {
  //     await groupRef
  //       .doc(groupId)
  //       .get()
  //       .then(function (doc) {
  //         groups.push(doc.data());
  //       })
  //       .catch(function (error) {
  //         // eslint-disable-next-line no-console
  //         console.error("Error get document: ", error);
  //       });
  //   });
  //   this.groups = groups;
  // }
  // static updateGroup(group) {
  //   db.collection("group")
  //     .doc(group.id)
  //     .set(group)
  //     .then(function (docRef) {})
  //     .catch(function (error) {
  //       // eslint-disable-next-line no-console
  //       console.error("Error writing document: ", error);
  //     });
  // }
  // static addNewGroupToUser(user, groupId) {
  //   const groups = user.groups ? user.groups : [];
  //   const existed = groups.filter((group) => group === groupId);
  //   if (existed.length === 0) {
  //     groups.push(groupId);
  //     user.groups = groups;
  //     const userRef = db.collection("user");
  //     userRef.doc(user.uid).set(user);
  //   }
  // }
}

// filterGroup(userArray) {
//   const vm = this
//   vm.groups = []
//   return new Promise((resolve, reject) => {
//     let groupRef = db.collection('group')
//     userArray.forEach((userId) => {
//       groupRef = groupRef.where('members', '==', userId)
//     })
//     groupRef
//       .get()
//       .then(function (querySnapshot) {
//         const allGroups = []
//         querySnapshot.forEach((doc) => {
//           const data = doc.data()
//           data.id = doc.id
//           allGroups.push(data)
//        })
//        if (allGroups.length > 0) {
//          resolve(allGroups[0])
//        } else {
//          resolve(null)
//        }
//     })
//     .catch(function (error) {
//       reject(error)
//     })
//   })
// }
