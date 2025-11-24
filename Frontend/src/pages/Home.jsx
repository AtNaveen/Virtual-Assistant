import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImage from "../assets/user.gif";

const Home = () => {
  const {
    userData,
    getGeminiResonse,
    BACKEND_URL,
    setUserData,
    handleCurrentUser,
  } = useContext(UserContext);

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const navigate = useNavigate();
  const synth =
    typeof window !== "undefined" && window.speechSynthesis
      ? window.speechSynthesis
      : null;

  const handleLogout = async () => {
    try {
      await axios(BACKEND_URL + "/api/auth/logout", { withCredentials: true });
      navigate("/login");
      setUserData(null);
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const speak = (text) => {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;

    try {
      const recog = recognitionRef.current;
      if (recog && isListeningRef.current) {
        if (typeof recog.abort === "function") recog.abort();
        else if (typeof recog.stop === "function") recog.stop();
      }
    } catch (e) {
      console.log("Stop-before-speak error:", e);
    }

    utter.onend = () => {
      isListeningRef.current = false;
      isSpeakingRef.current = false;
      setAiText("");
      setTimeout(() => startRecognition(), 800);
    };

    try {
      synth.speak(utter);
    } catch (e) {
      console.log("speechSynthesis.speak error:", e);
      isSpeakingRef.current = false;
      setAiText("");
      startRecognition();
    }
  };

  const startRecognition = () => {
    const recog = recognitionRef.current;
    if (!recog) return;
    try {
      if (!isListeningRef.current) {
        recog.start();
      }
    } catch (error) {
      console.log("Recognition start error:", error);
    }
  };

  const handlecommand = async (data) => {
    const { type, userInput, response } = data;
    if (response) speak(response);

    setUserData((prev) => ({
      ...prev,
      history: [...(prev?.history || []), userInput],
    }));

    if (type === "google-search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    }

    if (type === "youtube-search") {
      const q = userInput || response || "trending";
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (!userData) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onstart = () => {
      isListeningRef.current = true;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      if (!isSpeakingRef.current) setTimeout(() => startRecognition(), 500);
    };

    recognition.onerror = (event) => {
      if (event?.error && event.error !== "aborted") {
        setTimeout(() => startRecognition(), 500);
      }
    };

    recognition.onresult = async (e) => {
      if (isSpeakingRef.current) return;
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (
        userData?.assistantName &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        try {
          const recog = recognitionRef.current;
          if (recog && isListeningRef.current) {
            if (typeof recog.abort === "function") recog.abort();
            else if (typeof recog.stop === "function") recog.stop();
          }
        } catch (err) {
          console.log("Error stopping recognition on wake:", err);
        }

        setUserText(transcript);
        setAiText("");
        const command = await getGeminiResonse(transcript);

        if (command) {
          command.userInput = transcript
            .replace(userData.assistantName, "")
            .trim();

          await handlecommand(command);

          try {
            await handleCurrentUser();
          } catch (err) {
            console.log("Error refreshing user after command:", err);
          }

          setAiText(command.response || "");
        }
        setUserText("");
      }
    };

    startRecognition();

    return () => {
      try {
        const recog = recognitionRef.current;
        if (recog) {
          recog.onstart = null;
          recog.onend = null;
          recog.onerror = null;
          recog.onresult = null;
          if (typeof recog.abort === "function") recog.abort();
          else if (typeof recog.stop === "function") recog.stop();
        }
      } catch (e) {
        console.log("Error during cleanup stop/abort:", e);
      } finally {
        recognitionRef.current = null;
        isListeningRef.current = false;
        isSpeakingRef.current = false;
      }
    };
  }, [userData]);

  const renderHistoryItem = (item, idx) => {
    let text;
    if (item === null || item === undefined) text = String(item);
    else if (typeof item === "string") text = item;
    else if (typeof item === "object") {
      try {
        text = item.command || item.request || JSON.stringify(item);
      } catch {
        text = String(item);
      }
    } else text = String(item);

    return (
      <div
        key={idx}
        className="text-white/90 text-sm py-1 border-b border-white/5 last:border-b-0"
      >
        {text}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-start flex-col p-4">
  
      <div className="hidden sm:flex gap-4 absolute top-6 right-6 z-30">
        <button
          onClick={() => navigate("/customize")}
          className="min-w-[150px] h-[48px] text-black font-semibold bg-white rounded-full text-[16px]"
        >
          Customize your Assistant
        </button>

        <button
          onClick={handleLogout}
          className="min-w-[130px] h-[48px] text-black font-semibold bg-white rounded-full text-[16px]"
        >
          Logout
        </button>
      </div>

   
      <button
        className="sm:hidden absolute top-4 right-4 z-40 p-2 rounded bg-white/10"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-11/12 max-w-xs bg-[#071033] z-50 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded bg-white/10"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={() => {
                  navigate("/customize");
                  setMenuOpen(false);
                }}
                className="w-full py-3 rounded bg-white text-black font-medium"
              >
                Customize Assistant
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full py-3 rounded bg-white text-black font-medium"
              >
                Logout
              </button>
            </div>

            <div className="border-t border-white/10 pt-3">
              <h4 className="text-white mb-2">History</h4>
              <div className="max-h-[50vh] overflow-auto">
                {userData?.history && userData.history.length > 0 ? (
                  [...userData.history].reverse().map((h, i) =>
                    renderHistoryItem(h, i)
                  )
                ) : (
                  <div className="text-white/70 text-sm">No history yet.</div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      <div className="w-full max-w-[900px] mx-auto flex flex-col items-center mt-16 sm:mt-12">
       
        <div className="w-[220px] h-[300px] sm:w-[300px] sm:h-[400px] flex justify-center items-center overflow-hidden rounded-4xl">
          <img
            src={userData?.assistantImage}
            alt="assistant"
            className="h-full w-full object-cover"
          />
        </div>

        <h1 className="text-white mt-6 text-3xl sm:text-2xl font-bold text-center">
          I'm {userData?.assistantName}
        </h1>

        {!aiText && (
          <img
            src={userImage}
            alt="user"
            className="w-[160px] sm:w-[200px] mt-4"
          />
        )}
        {aiText && <img src={ai} alt="ai" className="w-[160px] sm:w-[200px] mt-4" />}

        <h2 className="text-white mt-4 text-lg sm:text-2xl font-medium text-center px-4">
          {userText || aiText}
        </h2>

        <div className="hidden sm:block w-full max-w-[720px] mt-6 bg-white/5 rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-lg font-semibold">History</h2>
            <small className="text-white/60">
              {(userData?.history || []).length} items
            </small>
          </div>

          <div className="max-h-[300px] overflow-auto">
            {userData?.history && userData.history.length > 0 ? (
              [...userData.history].reverse().map((h, i) =>
                renderHistoryItem(h, i)
              )
            ) : (
              <div className="text-white/70 text-sm">No history yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
