import Head from "next/head";
import React from "react";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;
//ServerSide Rendering for fast fetching i.e whrn the user clicks on the chats the server don't need to fetch the ChatScreen components all over again but it will async i.e the server has already rendered all the ChatScreen componrnts and Show them all at once once the usr cliks on the chat

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  // Fetching all the meessages on the server
  const messagesRef = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRef.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  //Prepping the chats

  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };
  //   console.log(chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  /* Hides the bottom scroolbar from all the others browsers */
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
