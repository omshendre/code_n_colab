import React, { useEffect, useRef, useState } from "react";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import logo from "../../public/Code-n-Colab.png";
import Client from "../Components/Client";
import toast from "react-hot-toast";
import Editor from "../Components/Editor";
import Output from "../Components/Output";
import ACTIONS from "../Actions";
import axios from "axios";
import Stats from "../Components/Stats";

function EditorPage() {
  const socketRef = useRef();
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [input, setInput] = useState(" ");
  const [userInput, setUserInput] = useState(null);
  const [output, setOutput] = useState(" ");
  const [lang, setLang] = useState("c++");

  const reactNavigator = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("socket connection failed, try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (err) {
      toast.error("Could not copy room ID");
      console.log(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  const LANGUAGE_VERSIONS = {
    "c++": "10.2.0",
    "c": "10.2.0",
    "python": "3.10.0",
    "java": "15.0.2",
    "javascript": "1.32.3",
    "sqlite3": "3.36.0",
  };

  const executeCode = async (lang, sourceCode, userInput) => {
    const response = await API.post("/execute", {
      language: lang,
      version: LANGUAGE_VERSIONS[lang],
      files: [
        {
          content: sourceCode,
        },
      ],
      stdin: userInput,
    });
    return response.data;
  };

  async function runcode() {
    try {
      const { run: result } = await executeCode(lang, input, userInput);
      setOutput(result.output);
      console.log(result);
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    }
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div id="mainWrap" className="flex h-[100%] no-scrollbar">
      <div
        id="aside"
        className="bg-[#1c1e29] text-[#fff] flex flex-col w-[18%] h-screen"
      >
        <div id="asideInner" className="h-screen pl-3 gap-1">
          <div id="logo" className="flex p-4 items-center justify-center">
            <img src={logo} className="w-[50vw] h-16 border-[#424242]"></img>
          </div>
          <h3 className="text-white font-bold mb-5">Connected</h3>
          <div
            id="clientsList"
            className="flex flex-wrap max-h-[30rem] gap-[20px] overflow-x-auto no-scrollbar"
          >
            {clients.map((client) => (
              <Client key={client.socketId} userName={client.username} />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 bg-[#1c1e29] p-[18px]">
          <button
            className="w-[80%] bg-[#00ff00] p-[5px] text-black font-bold rounded-[5px]"
            onClick={runcode}
          >
            RUN
          </button>
          <button
            className="w-[80%] bg-white p-[5px] text-black font-bold rounded-[5px]"
            onClick={copyRoomId}
          >
            Copy room ID
          </button>
          <button
            className="w-[80%] bg-slate-800 border-slate-400 border p-[5px] text-white font-bold rounded-[5px]"
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
      <div id="editorwrap" className="w-[50%] h-screen overflow-hidden">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
            setInput(code);
          }}
          onLangChange={(lang) => {
            setLang(lang);
          }}
        />
      </div>
      <div className="w-[32%]">
        <Stats setInput={setUserInput} />
        <Output output={output} />
      </div>
    </div>
  );
}

export default EditorPage;
