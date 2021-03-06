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

const TOGGLE_SCREEN = gql`
  mutation ToggleScreen($name: String!, $open: Boolean!) {
    toggleScreen(name: $name, open: $open) {
      name
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
        screenAdded?: Screen;
        screenToggled?: Screen;
      }>({
        document: SCREEN_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          console.log(prev, subscriptionData);
          if (!subscriptionData.data) {
            return prev;
          }

          if (subscriptionData.data.screenAdded) {
            return {
              screens: [...prev.screens, subscriptionData.data.screenAdded],
            };
          }

          return prev;
        },
      });
    }
  }, [subscribeToMore]);

  const [addScreen] = useMutation(ADD_SCREEN);
  const [toggleScreen] = useMutation(TOGGLE_SCREEN, {
    update(cache, { data: { toggleScreen } }) {
      const screens = cache.readQuery<{
        screens: Screen[];
      }>({ query: SCREENS });

      const oldScreen = screens?.screens.find(
        (screen) => screen.name === toggleScreen.name
      );
      const newScreen = {
        ...oldScreen,
        ...toggleScreen,
      };

      let newScreens = [...(screens?.screens ?? [])];

      if (oldScreen) {
        const oldIndex = screens?.screens.indexOf(oldScreen);
        if (oldIndex !== undefined) {
          newScreens.splice(oldIndex, 1, newScreen);
        }
      } else {
        newScreens.push(newScreen);
      }

      cache.writeQuery({
        query: SCREENS,
        data: {
          screens: newScreens,
        },
      });
    },
  });

  const nameInput = useRef<HTMLInputElement | null>(null);
  const contentInput = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="p-4">
      <button className="rounded border p-2" onClick={() => refetch()}>
        Get Rooms
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addScreen({
            variables: {
              name: nameInput.current?.value ?? "Untitled Screen",
              content: contentInput.current?.value ?? "Some Content",
            },
          });

          if (nameInput.current && contentInput.current) {
            nameInput.current.value = "";
            contentInput.current.value = "";
          }
        }}
      >
        <div className="space-y-2 mt-2">
          <input
            className="block border"
            type="text"
            placeholder="Holo Name"
            ref={nameInput}
          />
          <textarea
            className="block border"
            placeholder="Holo Content"
            ref={contentInput}
          ></textarea>
          <button type="submit">Create Screen</button>
        </div>
        {error && (
          <div className="text-red-500">
            Error creating screen. Please try again.
          </div>
        )}
      </form>
      {<h3>{loading ? "Loading..." : "Screens"}</h3>}
      <ul>
        {data?.screens.map((screen) => (
          <li key={screen.name}>
            {screen.name} ({screen.open ? "open" : "closed"})
            <button
              className="border"
              onClick={() => {
                toggleScreen({
                  variables: {
                    name: screen.name,
                    open: !screen.open,
                  },
                });
              }}
            >
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
