import React from "react";
import Avatar from "react-avatar";

// Simple color hashing function
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 100%, 70%)`;
  return color;
};

function Client({ userName }) {
  // Use the color hashing function to get a consistent color for the userName
  const avatarColor = stringToColor(userName);

  return (
    <div id="client" className="flex flex-col items-center font-bold">
      <Avatar
        name={userName}
        size={50}
        round="5px"
        color={avatarColor} // Use the generated color
        fgColor="black"
      />
      <span id="username" className="mt-[10px] capitalize">
        {userName}
      </span>
    </div>
  );
}

export default Client;