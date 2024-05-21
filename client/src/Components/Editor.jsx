import React, { useEffect, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import ACTIONS from "../Actions";

function Editor({ socketRef, roomId, onCodeChange, onLangChange }) {
  const [newCode, setNewCode] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setNewCode(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  function handleLang(e) {
    const lang = e.target.value;
    setLanguage(lang);
    onLangChange(lang);
  }

  function handleTheme(e) {
    setTheme(e.target.value);
  }

  return (
    <div>
      <div className="p-6 flex pt-9 gap-4 ">
        <select
          name="language"
          id="language"
          className="bg-white p-1 rounded-lg px-4 font-bold  flex justify-center items-center "
          onChange={handleLang}
        >
          <option value="cpp" className="flex justify-center items-center">
            C++
          </option>
          <option value="c">C</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="sqlite3">SQL</option>
          <option value="javascript">JavaScript</option>
        </select>
        <select
          name="theme"
          id="theme"
          className="bg-white p-1 rounded-lg px-4 font-bold  flex justify-center items-center "
          onChange={handleTheme}
        >
          <option value="vs-dark" className="flex justify-center items-center">
            Dark
          </option>
          <option value="vs-light" className="flex justify-center items-center">
            Light
          </option>
        </select>
      </div>
      <MonacoEditor
        height="90vh"
        language={language}
        theme={theme}
        value={newCode}
        onChange={(code) => {
          setNewCode(code);
          onCodeChange(code);
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }}
      />
    </div>
  );
}

export default Editor;
