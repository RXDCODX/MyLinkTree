import { useCallback } from "react";
import { Button } from "react-bootstrap";

export const DonateBlock = () => {
  const changeLink = useCallback(() => {
    window.location.href = "https://www.donationalerts.com/r/rxdcodx";
  }, []);

  return (
    <>
      <h2>DONATE</h2>
      <Button target="_blank" variant="primary" onClick={() => changeLink()}>
        Donation Alerts
      </Button>
    </>
  );
};
