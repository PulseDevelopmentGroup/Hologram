import React from "react";
import { RouteComponentProps } from "react-router";
import { FC } from "react";
import { useSocket } from "./useSocket";

interface AdminProps extends RouteComponentProps {}

export const Admin: FC<AdminProps> = (props) => {
  const socket = useSocket();
  console.log(socket);

  const handlePing = () => {
    socket.emit("boop", "hello");
  };

  return (
    <div>
      <button onClick={handlePing}>Ping</button>
    </div>
  );
};
