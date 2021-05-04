import styled from "styled-components";
import React from "react";

import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <div>
      <Container>
        <Head>
          <title>Login</title>
        </Head>

        <LoginContainer>
          <Logo src="/logo.png" />
          <Button
            style={{ border: "1px solid black", borderRadius: "5px" }}
            onClick={signIn}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "1.5rem",
                fontFamily: "Itim",
              }}
            >
              Sign in with Google.
            </span>
          </Button>
        </LoginContainer>
      </Container>
    </div>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
  align-items: center;
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  object-fit: contain;
  margin-bottom: 20px;
`;
