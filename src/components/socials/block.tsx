import { useCallback } from "react";
import { Button } from "react-bootstrap";

export const SocialBlock = () => {
  const changeLink = useCallback(
    (link: string) => (window.location.href = link),
    []
  );

  return (
    <>
      <h2>SOCIALS</h2>
      <Button onClick={() => changeLink("https://t.me/ZeChosenPessimist")}>
        TELEGRAM
      </Button>
      <Button onClick={() => changeLink("https://t.me/PYROKXNEZXZ_group")}>
        TG CHAT
      </Button>
      <Button onClick={() => changeLink("https://discord.gg/XWXDERj95x")}>
        DISCORD
      </Button>
      <Button onClick={() => changeLink("https://vk.com/pyrokxnezxz_official")}>
        VK GROUP
      </Button>
    </>
  );
};
