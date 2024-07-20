import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(false);

  const surpriseOptions = [
    "What is the Height of tallest man in the world",
    "What percentage of world is undiscovered",
    "Why can't i get a topic to search",
    "What will happen if a asteroid hits on earth",
    "Which animal is responsible for the most amount of deaths",
    "What does heaven looks like",
    "Which language is most difficult to learn",
    "Do girth matters if i want to increase forearms",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
    // console.log(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error : Please provide some value");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history:
          //  {
          //   parts: chatHistory.map(entry => ({
          //     role: entry.role,
          //     content: entry.parts,
          //   })),
          // },
          {chatHistory},
          message: value,
        }),
        headers : {
          "Content-Type" : "application/json"
        }
      }

      const response = await fetch("http://localhost:8000/gemini",options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory , {
        role:"user",
        parts:value,
      },{
        role:"model",
        parts:data,
      }],
      )
          
  


      setValue("")
      
    } catch (error) {
      console.error(error);
      setError("Error while fetching" + error);
    }
  };


  const clear = ()=>{
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="h-screen w-screen">
      <section
        id="search-section"
        className="h-fit w-full flex flex-col items-start justify-start pt-20 pl-10 xl:pl-40"
      >
        <p className="text-lg xl:text-2xl md:text-xl mb-5 ">
          What do you want to know?
          <button
            id="surprise"
            className="px-1 rounded-lg bg-[#4546472c] font-semibold ml-3"
            onClick={surprise}
            disabled={!chatHistory}
          >
            Surprise me😲
          </button>
        </p>
        <div
          className="text-xl border rounded-xl pl-2 mb-8 shadow-xl shadow-pink-300"
          id="input-container"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Ask me anything decent..."
            className="text-xl pl-2 py-3 mr-3 w-80 outline-none md:w-[32rem] xl:w-[55rem]"
          />
          {!error && (
            <button
            onClick={()=>{getResponse(); console.log("clicked")}}
              id="send-button"
              className="text-xl py-3 px-4 bg-black text-white rounded-lg rounded-tl-none rounded-bl-none font-semibold"
            >
              send
            </button>
          )}
          {error && (
            <button
            onClick={clear}
              id="clear-button"
              className="text-xl py-3 px-4 bg-[#3335376e] rounded-lg font-semibold"
            >
              clear
            </button>
          )}
        </div>

        {error && <p className="text-xl text-red-600 animate-bounce">{error}</p>}

        <div
          id="search-result"
          className="w-[26rem] xl:w-[61rem] md:w-[38rem] border-1"
        >
          {
            chatHistory.map((i,index)=>{
              return(<div className="h-fit w-full rounded-sm bg-slate-300 mb-2 text-xl" key={index}>
                <p><b>{i.role}</b> : {i.parts}</p>
              </div>)
            })
          }
        </div>
      </section>
    </div>
  );
}

export default App;
