import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { FC } from "react";
import { useSocket } from "./useSocket";

interface AdminProps extends RouteComponentProps {}

export const Admin: FC<AdminProps> = (props) => {
  const [rooms, setRooms] = useState<string[]>([]);
  const socket = useSocket();
  console.log(socket);

  const getServers = () => {
    socket.emit("get rooms", setRooms);
  };

  return (
    <div>
      <button onClick={getServers}>Get Rooms</button>
      <ul>
        {rooms.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>
    </div>
  );
};
