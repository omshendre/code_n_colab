import React from "react";
import Avatar from "react-avatar";

function Client({ userName }) {
  return (
    <div id="client" className="flex flex-col items-center font-bold    ">
      <Avatar
        name={userName}
        size={50}
        round="5px"
        color="#ffd800"
        fgColor="black "
      />
      <span id="username" className="mt-[10px] capitalize ">
        {userName}
      </span>
    </div>
  );
}

export default Client;
