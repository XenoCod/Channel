import React from "react";
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img style={{ marginBottom: 10 }} height={200} src="/logo.png" />
        <Circle color="#000" size={60} />
      </div>
    </center>
  );
}

export default Loading;
