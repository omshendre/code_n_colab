import React, { useEffect, useRef, useState } from "react";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import logo from "../assets/Code-n-Colab_in.png";
import Client from "../Components/Client";
import toast from "react-hot-toast";
import Editor from "../Components/Editor";
import Output from "../Components/Output";
import ACTIONS from "../Actions";
import axios from "axios";
import Stats from "../Components/Stats";
// **********************IMPORTS********************************










function EditorPage() {
  // Create a reference to hold the socket instance.
  const socketRef = useRef();
  // code ref
  const codeRef = useRef(null);
  // Get the current location using the useLocation hook.
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [input, setInput] = useState(" ");
  const [userInput, setUserInput] = useState(null);
  const [output, setOutPut] = useState(" ");
  const [lang, setLang] = useState("c++");

  // const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
  const reactNavigator = useNavigate();










// **********************SOCKET********************************
  useEffect(() => {
    const init = async () => {
      // Wait for the socket initialization and store the instance in the ref.
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("socket connection failed , try again later");
        reactNavigator("/");
      }

      console.log(import.meta.env.VITE_REACT_APP_BACKEND_URL);
      // Emit a 'JOIN' action to the server using the current socket instance and pass roomId and username which we will store in our map
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room `);
            console.log(`${username} joined the room `);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        // Update the client list state by filtering out the disconnected client.
        setClients((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });
    };
    init();
    //  a cleanup function to be executed when the component is unmounted or the effect is re-run.
    return () => {
      // Disconnect the current socket instance from the server.
      socketRef.current.disconnect();

      // Remove event listeners for the 'JOINED' and 'DISCONNECTED' actions from the current socket instance.
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);










// **********************COPY_ROOM_CODE********************************

  //function to copy room Id
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (err) {
      toast.error("Could not copy room ID");
      console.log(err);
    }
  }

  // we wil navigate to home page this will trriger return of useEffect in editor page which will do socket.off() method this will remove socket  from connection
  function leaveRoom() {
    reactNavigator("/");
  }










// **********************API********************************
const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
const LANGUAGE_VERSIONS = {
  "c++":"10.2.0",
  "c":"10.2.0",
  "python":"3.10.0",
  "java":"15.0.2",
  "javascript":"1.32.3",
  "sqlite3":"3.36.0",
}

const executeCode = async (lang, sourceCode, userInput) => {
  const response = await API.post("/execute", {
    language: lang,
    version: LANGUAGE_VERSIONS[lang], // Assuming LANGUAGE_VERSIONS is defined somewhere
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
      const { run: result } = await executeCode(lang,input,userInput);
      // setOutput(result.output.split("\n"));
      setOutPut(result.output);
      console.log(input);
      console.log(result.output);
    } catch (error) {
      toast.error(`${error}`);
      console.error(error);
    }
  }
  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div id="mainWrap" className=" flex    h-[100%]   no-scrollbar ">
      <div
        id="aside"
        className="bg-[#1c1e29] text-[#fff] flex  flex-col w-[18%] h-screen "
      >
        <div id="asideInner" className=" h-screen pl-3 gap-1 ">
          <div
            id="logo"
            className="flex 
            p-4 items-center justify-center "
          >
            <img src={logo} className="  w-[50vw] h-16 border-[#424242] "></img>
          </div>
          <h3 className="text-white font-bold mb-5  ">Connected</h3>
          <div
            id="clientsList"
            className="flex flex-wrap max-h-[30rem] gap-[20px] overflow-x-auto no-scrollbar  "
          >
            {clients.map((client) => (
              <Client key={client.socketId} userName={client.username} />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center  items-center  gap-2 bg-[#1c1e29] p-[18px]">
          <button
            className=" w-[80%]  bg-[#00ff00] p-[5px] text-black font-bold rounded-[5px]   "
            onClick={runcode}
          >
            RUN
          </button>
          <button
            className=" w-[80%]  bg-white p-[5px] text-black font-bold rounded-[5px]   "
            onClick={copyRoomId}
          >
            Copy room ID
          </button>
          <button
            className=" w-[80%] bg-slate-800 border-slate-400 border p-[5px] text-white font-bold rounded-[5px]  "
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
      <div id="editorwrap" className=" w-[50%] h-screen overflow-hidden   ">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
            setInput(code); //  code to  run
          }}
          onLangChange={(lang) => {
            setLang(lang);
            console.log(lang);
          }}
        />
      </div>
      <div className=" w-[32%] ">
        <Stats setInput = {setUserInput}/>
        <Output output={output} />
      </div>
    </div>
  );
}

export default EditorPage;
