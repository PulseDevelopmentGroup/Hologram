import io from "socket.io-client";

const socket = io("http://localhost:4001");

socket.on("connect", (data: any) => {
  console.log("socket connected", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected ");
});

const joinedRooms: string[] = [];

export function useSocket(screenId?: string) {
  if (screenId && !joinedRooms.includes(screenId)) {
    socket.emit("join", screenId);
  }

  return socket;
}
