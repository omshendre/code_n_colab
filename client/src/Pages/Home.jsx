import React, { useState } from "react";
import logo from "../assets/Code-n-Colab.png";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Button from "../Components/Button";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigte = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New room is created");
  };

  const joinRoom = () => {
    if (!roomId) {
      toast.error("ROOM ID is required");
    } else if (!username) {
      toast.error("User Name is required");
    } else {
      navigte(`/editor/${roomId}`, {
        state: {
          username,
        },
      });
    }
  };

  const handleInput = (e) => {
    if (e.code == "Enter") {
      joinRoom();
    }
  };

  return (
    <div
      id="homePageWrapper "
      className="flex
     justify-center items-center pt-[15vh]  text-[#fff]   "
    >
      <div
        id="formWrapper"
        className="bg-[#282a36] p-[45px]  rounded-[5px] w-[450px] max-w-[90%] gap-8  "
      >
        <div
          className="flex
            p-3 pb-5 gap- items-center justify-center "
        >
          <img src={logo} className=" h-13 "></img>
        </div>
        <div id="mainLabel" className="mb-[20px] mt-0 font-bold ">
          {" "}
          Paste invitation Room ID{" "}
        </div>
        <div id="inputGroup" className="flex flex-col w-[100%] ">
          <input
            type="text"
            id="inputBox"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInput}
            className="border border-[#ffd800] rounded-[5px] p-[8px] outline-none mb-[14px] bg-transparent font-bold "
          />
        </div>
        <div id="inputGroup">
          <input
            type="text"
            id="inputBox"
            placeholder="User Name"
            value={username}
            onKeyUp={handleInput}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-[#ffd800] rounded-[5px] p-[8px] outline-none mb-[14px] bg-transparent w-[100%] font-bold "
          />
        </div>

        <div className="flex  w-[100%] ">
          <button
            className=" w-[100px]  bg-[#ffd800] p-[5px] text-black font-bold rounded-[5px] ml-auto hover:bg-[#897608] "
            onClick={joinRoom}
          >
            Join
          </button>
        </div>
        <div className="mt-5">
          <span id="createInfo" onClick={createNewRoom}>
            If you don't have an invite then create &nbsp;
            <a
              href=""
              id="createNewBtn"
              className="text-[#FFD800]  hover:text-[#897608] font-bold "
            >
              New Room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
