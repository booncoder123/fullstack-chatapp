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

//NOTE  query : query user by email
const Query1 = (email) =>
  useCollection(query(collection(db, "user"), where("email", "==", email)), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export { Query1 };
