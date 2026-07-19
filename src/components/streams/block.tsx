import MyButton from "../MyButton/MyButton";
import twitchData from "../../data/twitch.json";

export const StreamsBlock = () => {
  return (
    <>
      <h2>STREAMS</h2>
      <MyButton link={`https://twitch.tv/${twitchData.login}`}>
        {twitchData.displayName}
      </MyButton>
    </>
  );
};
