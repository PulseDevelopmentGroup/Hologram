import React, { useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { FC } from "react";
import { Screen } from "./types";
import { gql, useQuery, useMutation } from "@apollo/client";

interface AdminProps extends RouteComponentProps {}

const SCREENS = gql`
  {
    screens {
      name
      content
      open
    }
  }
`;

const ADD_SCREEN = gql`
  mutation AddScreen($name: String!, $content: String!) {
    addScreen(name: $name, content: $content) {
      name
      content
      open
    }
  }
`;

const SCREEN_SUBSCRIPTION = gql`
  subscription onScreenAdded {
    screenAdded {
      name
      content
      open
    }
  }
`;

export const Admin: FC<AdminProps> = (props) => {
  const { loading, error, data, refetch, subscribeToMore } = useQuery<{
    screens: Screen[];
  }>(SCREENS);

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToMore<{
        screenAdded: Screen;
      }>({
        document: SCREEN_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          console.log(prev, subscriptionData);
          if (!subscriptionData.data) {
            return prev;
          }

          return {
            screens: [...prev.screens, subscriptionData.data.screenAdded],
          };
        },
      });
    }
  }, [subscribeToMore]);

  const [addScreen] = useMutation(ADD_SCREEN);

  const nameInput = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <button onClick={() => refetch()}>Get Rooms</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addScreen({
            variables: {
              name: nameInput.current?.value ?? "Untitled Screen",
              content: "",
            },
          });

          if (nameInput.current) {
            nameInput.current.value = "";
          }
        }}
      >
        <input type="text" ref={nameInput} />
        <button type="submit">Create Screen</button>
        {error && (
          <div className="text-red-500">
            Error creating screen. Please try again.
          </div>
        )}
      </form>
      {<h3>{loading ? "Loading..." : "Screens"}</h3>}
      <ul>
        {data?.screens.map((screen) => (
          <li key={screen.name}>{screen.name}</li>
        ))}
      </ul>
    </div>
  );
};
