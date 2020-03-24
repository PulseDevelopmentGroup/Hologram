import * as React from "react";
import { FC } from "react";
import { RouteComponentProps } from "react-router";

interface RouteProps {
  screenNumber?: string;
}

interface ScreenProps extends RouteComponentProps<RouteProps> {}

export const Screen: FC<ScreenProps> = (props) => {
  console.log(props);

  return <div>I'm a screen</div>;
};
