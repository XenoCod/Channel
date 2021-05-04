import styled from "styled-components";
import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "../pages/Chat";
import SignOut from "@material-ui/icons/ExitToApp";
import Add from "@material-ui/icons/Add";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Please enter your email id to start a chat with me!");

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      input !== user.email &&
      !chatAlreadyPresent(input)
    ) {
      // This will be excuted when the input is validated and correct
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyPresent = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <AppName>
          <UserAvatar src={user.photoURL} /> <img src="/logo.png" />
        </AppName>
        <IconsConatainer>
          <IconButton>
            <SignOut onClick={() => auth.signOut()} style={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <ChatIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: "#fff" }} />
          </IconButton>
        </IconsConatainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton style={{ border: "1px solid black" }} onClick={createChat}>
        <Add />
        <span
          style={{ fontWeight: "bolder", fontSize: "1rem", fontFamily: "Itim" }}
        >
          Start a new chat
        </span>
      </SidebarButton>

      {/* Chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

// Using Styled Compomnents

const AppName = styled.div`
  display: "flex";
  width: 50%;

  > img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    filter: invert(1);
    display: flex;
    text-align: center;
  }
`;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  justify-content: space-between;
  background: #0575e6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #021b79,
    #0575e6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #021b79,
    #0575e6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  padding: 15px;
  border-bottom: 1px solid whitesmoke;
  height: 85px;
  z-index: 1;
  border-bottom-right-radius: 20px;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsConatainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  flex: 1;
  border: none;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  color: #125589;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
  /* Increases the priority if we use the &&& */
`;
