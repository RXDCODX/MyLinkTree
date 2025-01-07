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
      <Button
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => changeLink("https://shikimori.one/PYROKXNEZXZ")}
      >
        SHIKIMORI
      </Button>
      <Button
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => changeLink("https://github.com/Pyrok1nezyz")}
      >
        GIT HUB
      </Button>
      <Button
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => changeLink("https://t.me/pyrosbar")}
      >
        TGC 18+
      </Button>
    </>
  );
};
