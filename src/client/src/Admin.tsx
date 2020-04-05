import React, { useRef } from "react";
import { RouteComponentProps } from "react-router";
import { FC } from "react";
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

export const Admin: FC<AdminProps> = (props) => {
  const { loading, error, data, refetch } = useQuery<{
    screens: {
      name: string;
      content: string;
      open: boolean;
    }[];
  }>(SCREENS);

  const [addScreen, _] = useMutation(ADD_SCREEN);

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
      </form>
      {loading && <h3>Loading...</h3>}
      <ul>
        {data?.screens.map((screen) => (
          <li key={screen.name}>{screen.name}</li>
        ))}
      </ul>
    </div>
  );
};
