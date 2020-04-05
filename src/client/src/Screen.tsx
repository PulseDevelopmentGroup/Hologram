import * as React from "react";
import { FC } from "react";
import { RouteComponentProps } from "react-router";

interface RouteProps {
  screenNumber?: string;
}

interface ScreenProps extends RouteComponentProps<RouteProps> {}

export const Screen: FC<ScreenProps> = ({ match, ...props }) => {
  const { screenNumber } = match.params;

  return <div>Hello, I'm screen number {screenNumber}</div>;
};
