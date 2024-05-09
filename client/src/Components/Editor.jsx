import React, { useEffect, useRef, useState, useMemo } from "react";
import "../App.css";
import Codemirror from "codemirror";
//Theme CSS
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/3024-day.css";

import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import ACTIONS from "../Actions";
import { stringify } from "uuid";

function Editor({ socketRef, roomId, onCodeChange, onLangChange }) {
  // Using useRef hook to create a reference
  const editorRef = useRef();
  const [newCode, setNewCode] = useState(" ");
  const [theme, setTheme] = useState("dracula");
  useEffect(() => {
    async function init() {
      // Creating a CodeMirror instance from a textarea element with the id 'realtimeEditor'
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: theme,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
    }

    init();
  }, [theme]);

  useEffect(() => {
    // Adding a change event listener to the editor instance  which is a codemirror liabrary method
    editorRef.current.on("change", (instance, changes) => {
      // console.log(changes.text);
      // Destructuring the 'origin' property from the 'changes' object
      const { origin } = changes;

      // Getting the entire code from the editor instance after the change.

      const code = instance.getValue();
      // setNewCode(  (prev)=> prev=instance.getValue());

      onCodeChange(code); // this will return code to the editor page (child- parent deata transfer)

      // console.log(newCode);
      // console.log(code);

      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }

      // console.log(code);
    });
  }, [newCode]);

  function handleLang(e) {
    onLangChange(e.target.value);
  }
  function handleTheme(e) {
    setTheme(e.target.value);
    //console.log(theme);
  }

  useEffect(() => {
    if (socketRef.current) {
      // we will receive edited code by any socket by server
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setNewCode(code);

          editorRef.current.setValue(code);

          // console.log(editorRef.current.getValue());
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  useEffect(() => {
    console.log(newCode);
  }, [newCode]);

  return (
    <div>
      <div className="p-6 flex pt-9 gap-4 ">
        <select
          name="language"
          id="language"
          className="bg-white p-1 rounded-lg px-4 font-bold  flex justify-center items-center "
          onChange={handleLang}
        >
          <option value="c++" className="flex justify-center items-center">
            C++
          </option>
          <option value="c">C</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="sqlite3">SQL</option>
          <option value="javascript">JavaScript</option>
        </select>
        <select
          name="language"
          id="language"
          className="bg-white p-1 rounded-lg px-4 font-bold  flex justify-center items-center "
          onChange={handleTheme}
        >
          <option value="dracula" className="flex justify-center items-center">
            Dark
          </option>
          <option value="3024-day" className="flex justify-center items-center">
            Light
          </option>
        </select>
      </div>
      <textarea id="realtimeEditor" className="no-scrollbar"></textarea>
    </div>
  );
}

export default Editor;
