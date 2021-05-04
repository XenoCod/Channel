import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, Button, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import Night from "@material-ui/icons/NightsStay";
import MicIcon from "@material-ui/icons/Mic";
import Send from "@material-ui/icons/Send";
import { useState, useRef } from "react";
import firebase from "firebase";
import Message from "../components/Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessageRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  };
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  //Shows the messages once the user logs in
  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last seen:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>recently..</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: "#fff" }} />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <MessageEnd ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <IconButton>
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send
          </button>
          <Send style={{ color: "#125589" }} onClick={sendMessage} />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  background: #005c97; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #363795,
    #005c97
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #363795,
    #005c97
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const Header = styled.div`
  position: sticky;
  background: #005c97; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #363795,
    #005c97
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #363795,
    #005c97
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  z-index: 100;
  top: 0;

  display: flex;
  padding: 11px;
  height: 85px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  color: #fff;

  .h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: #fff;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  background-color: #fff;

  min-height: 90vh;
  padding: 30px;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  padding: 20px;
  outline: none;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
  border: 1px solid black;
  font-size: 1rem;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const MessageEnd = styled.div`
  margin-bottom: 50px;
`;
