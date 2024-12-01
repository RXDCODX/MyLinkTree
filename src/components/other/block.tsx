import { useCallback } from "react";
import { Button } from "react-bootstrap";

export const OtherBlock = () => {
  const changeLink = useCallback(
    (link: string) => (window.location.href = link),
    []
  );

  return (
    <>
      <h2>OTHER</h2>
      <Button onClick={() => changeLink("https://shikimori.one/PYROKXNEZXZ")}>
        SHIKIMORI
      </Button>
      <Button onClick={() => changeLink("https://github.com/Pyrok1nezyz")}>
        GIT HUB
      </Button>
    </>
  );
};
