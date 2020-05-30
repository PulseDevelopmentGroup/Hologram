import * as React from "react";
import { FC, useEffect } from "react";
import { RouteComponentProps, useRouteMatch, useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";
import { Screen } from "./types";

interface RouteProps {
  screenNumber?: string;
}

interface HoloProps extends RouteComponentProps<RouteProps> {}

const GET_SCREEN = gql`
  query Screen($name: String!) {
    screen(name: $name) {
      name
      content
      open
    }
  }
`;

const SUBSCRIBE_TO_SCREEN = gql`
  subscription onScreenToggled($name: String!) {
    screenToggled(name: $name) {
      name
      content
      open
    }
  }
`;

export const Holo: FC<HoloProps> = ({ match, ...props }) => {
  const { screenNumber } = useParams<{ screenNumber?: string }>();

  const { loading, error, data, subscribeToMore } = useQuery(GET_SCREEN, {
    variables: {
      name: screenNumber,
    },
  });
  const screen: Screen = data?.screen;

  useEffect(() => {
    if (subscribeToMore && screenNumber) {
      return subscribeToMore({
        document: SUBSCRIBE_TO_SCREEN,
        variables: {
          name: screenNumber,
        },
        updateQuery: (prev, { subscriptionData }) => {
          return {
            screen: subscriptionData.data.screenToggled,
          };
        },
      });
    }
  }, [subscribeToMore, screenNumber]);

  return (
    <div>
      {loading ? (
        <h3>Loading</h3>
      ) : (
        // <div>
        //   Hello, I'm screen number {screenNumber}.<h3>This is my data:</h3>
        //   open?:{screen?.open.toString()}
        //   <p>{JSON.stringify(screen)}</p>
        // </div>
        screen?.open && (
          <div className="fixed top-0 right-0 bottom-0 left-0 bg-red-200">
            <h1>{screen.name}</h1>
            {screen.content}
          </div>
        )
      )}
    </div>
  );
};
