import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  collection,
  document,
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

//NOTE get all group avaliable for this uid
const useGetGroupByUid = (uid) =>
  useCollection(
    query(collection(db, "group"), where("members", "array-contains", uid)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

const useGetGroupById = (groupId) =>
  useDocument(query(doc(db, "group", groupId)), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export { useGetGroupByUid, useGetGroupById };
