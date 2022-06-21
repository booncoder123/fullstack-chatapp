import { useState } from "react";
import { FormControl, Input, Button } from "@chakra-ui/react";
import {
  serverTimestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseconfig";

export default function Bottombar({ id, user }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending message");
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: input,
        sender: user.email,
        timestamp: serverTimestamp(),
      });

      await onSnapshot(collection(db, `chats/${id}/messages`), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        // console.log(source, " data: ", doc.data());
        console.log(source);
      });

      setInput("");
    } catch (error) {
      console.log("error na kub");
      console.log({ error });
    }
  };

  return (
    <FormControl p={3} onSubmit={sendMessage} as="form">
      <Input
        placeholder="Type a message..."
        autoComplete="off"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button type="submit" hidden>
        Submit
      </Button>
    </FormControl>
  );
}
