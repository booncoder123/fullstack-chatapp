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
import { auth, db } from "../../firebaseconfig";

//NOTE query user by uid
// const useGetUserByUid = (uid) =>
//   useDocument(query(doc(db, "user", uid)), {
//     snapshotListenOptions: { includeMetadataChanges: true },
//   });

const useGetMessageByGroupId = (groupId) => {
  const querySnapshot = useCollection(
    query(
      collection(db, "message", groupId, "messages"),
      orderBy("sentAt", "desc")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return querySnapshot;
};
export { useGetMessageByGroupId };
