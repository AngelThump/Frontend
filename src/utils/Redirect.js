import React, { useEffect, useParams } from "react";

export default function Redirect(props) {
  const { to, embed } = props;
  const { channel } = useParams();

  useEffect(() => {
    if (channel && embed) {
      window.location.href = `${process.env.REACT_APP_PLAYER_BASE}/?channel=${channel}`;
      return;
    }

    window.location.href = to;
  }, [to, channel, embed]);

  return <></>;
}
