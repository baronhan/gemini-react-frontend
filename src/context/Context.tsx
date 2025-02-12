import React, { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext<any>(null);

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);

    // Cập nhật state prevPrompts bằng cách thêm prompt mới vào cuối danh sách hiện tại
    // prev: là danh sách các prompt hiện tại (mảng cũ)
    // [...prev, input]: tạo một mảng mới bằng cách sao chép tất cả các phần tử cũ trong prev và thêm phần tử input vào cuối mảng
    // setPrevPrompts sẽ làm mới state prevPrompts với mảng mới này
    // setPrevPrompts((prev) => [...prev, input]);

    setPrevPrompts((prev) => [...prev, input]);
    const response = await run(input);

    let responseArray = response.split("**");

    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 == 0) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");

    let newResponseArray = newResponse2.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
