import React, { useEffect, useParams } from "react";

export default function Redirect(props) {
  const { to, embed } = props;
  const { channelName } = useParams();

  useEffect(() => {
    if (channelName && embed) {
      window.location.href = `${process.env.REACT_APP_PLAYER_BASE}/?channel=${channelName}`;
      return;
    }

    window.location.href = to;
  }, [to, channelName, embed]);

  return <></>;
}
