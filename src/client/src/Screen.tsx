import * as React from "react";
import { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useSocket } from "./useSocket";

interface RouteProps {
  screenNumber?: string;
}

interface ScreenProps extends RouteComponentProps<RouteProps> {}

export const Screen: FC<ScreenProps> = ({ match, ...props }) => {
  const { screenNumber } = match.params;

  const socket = useSocket(screenNumber);

  return <div>Hello, I'm screen number {screenNumber}</div>;
};
