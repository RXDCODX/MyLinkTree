import { useCallback } from "react";
import { Button } from "react-bootstrap";

export const StreamsBlock = () => {
  const changeLink = useCallback(
    (link: string) => (window.location.href = link),
    []
  );

  return (
    <>
      <h2>STREAMS</h2>
      <Button onClick={() => changeLink("https://twitch.com/pyrokxnezxz")}>
        TWITCH
      </Button>
    </>
  );
};
