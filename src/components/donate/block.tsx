import { useCallback } from "react";
import { Button } from "react-bootstrap";

export const DonateBlock = () => {
  const changeLink = useCallback(() => {
    window.location.href = "https://www.donationalerts.com/r/pyrokxnezxz";
  }, []);

  return (
    <>
      <h2>DONATE</h2>
      <Button variant="primary" onClick={() => changeLink()}>
        Donation Alerts
      </Button>
    </>
  );
};
