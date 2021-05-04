import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import moment from "moment";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const MessageType = user === userLoggedIn.email ? Sender : Reciever;
  return (
    <Container>
      <MessageType>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </MessageType>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background: #1e3c72; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2a5298,
    #1e3c72
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2a5298,
    #1e3c72
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  border-radius: 10px;
  color: #fff;
`;

const Reciever = styled(MessageElement)`
  background: #ffafbd; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ffc3a0,
    #ffafbd
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ffc3a0,
    #ffafbd
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  text-align: center;
  border-radius: 10px;
`;

const Timestamp = styled.span`
  color: #fff;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
