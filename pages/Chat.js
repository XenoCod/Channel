import styled from "styled-components";
import React from "react";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";
import timeAgo from "timeago-react";

function Chat({ id, users }) {
  const [user] = useAuthState(auth);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);
  const router = useRouter();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  return (
    <div>
      <Container onClick={enterChat}>
        {recipient ? (
          <UserAvatar src={user?.photoURL} />
        ) : (
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}

        <p>{recipientEmail}</p>
      </Container>
    </div>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  transition: all 0.5s;

  > p {
    font-weight: 600;
    color: #000;
  }

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
