import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import {
  collection,
  doc,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

function Chat() {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [seed, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (roomId) {
      const roomRef = doc(db, "rooms", roomId);
      onSnapshot(roomRef, (snapshot) => {
        setRoomName(snapshot.data()?.name);
      });

      const messagesRef = collection(db, "rooms", roomId, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      onSnapshot(messagesQuery, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      message: input,
      name: user.displayName,
      timestamp: serverTimestamp(),
      photoURL: user.photoURL,
    });

    setInput("");
  };

  return (
    <div className="chat">
      {/* Header */}
      <div className="chat-header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat-headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {messages.length > 0 &&
              new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
          </p>
        </div>
        <div className="chat-headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      {/* Body */}
      <div className="chat-body">
        {messages.map((message, idx) => (
          <p
            key={idx}
            className={`chat-message ${
              message.name === user.displayName && "chat-reciever"
            }`}
          >
            <span className="chat-name">{message.name}</span>
            {message.message}
            <span className="chat-timestamp">
              {message.timestamp?.toDate
                ? new Date(message.timestamp.toDate()).toUTCString()
                : ""}
            </span>
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <InsertEmoticonIcon />
        <div className="chat-input-wrapper">
          <MicIcon className="mic-icon" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <IconButton onClick={sendMessage} className="send-btn">
            <SendIcon style={{ color: "#128C7E" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Chat;
