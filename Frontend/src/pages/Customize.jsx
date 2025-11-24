import React, { useState, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { useNavigate } from "react-router-dom";
import { RiImageAddLine } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize = () => {
  const {
    BACKEND_URL,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
  } = useContext(UserContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-start py-8 px-4">
      <button
        onClick={() => navigate("/home")}
        aria-label="Back"
        className="absolute top-4 left-4 p-2 rounded-md bg-white/10 text-white sm:top-8 sm:left-8"
      >
        <MdKeyboardBackspace className="w-6 h-6" />
      </button>

      <main className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
          Select your <span className="text-blue-200">Assistant Image</span>
        </h1>

        <section className="w-full">
          <div className="w-full mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center items-start">
            <Card image={image1} />
            <Card image={image2} />
            <Card image={image3} />
            <Card image={image4} />
            <Card image={image5} />
            <Card image={image6} />
            <Card image={image7} />

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload custom image"
              onClick={() => {
                inputImage.current.click();
                setSelectedImage("input");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  inputImage.current.click();
                  setSelectedImage("input");
                }
              }}
              className={`flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer
                bg-[#020220] border-2 border-[#0000ff66] focus:outline-none focus:ring-2 focus:ring-white
                w-[96px] h-[160px] sm:w-[110px] sm:h-[180px] md:w-[140px] md:h-[200px] lg:w-[150px] lg:h-[250px]
                ${selectedImage === "input" ? "ring-4 ring-white" : ""}`}
            >
              {!frontendImage && (
                <RiImageAddLine className="text-white w-8 h-8 sm:w-10 sm:h-10" />
              )}

              {frontendImage && (
                <img
                  src={frontendImage}
                  alt="selected assistant"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={inputImage}
              onChange={handleImage}
              hidden
            />
          </div>
        </section>

        <div className="w-full max-w-2xl flex justify-center">
          <button
            onClick={() => navigate("/customize2")}
            disabled={!selectedImage}
            className="z-30 px-6 py-3 rounded-full text-[18px] font-semibold
                       bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed
                       fixed bottom-5 left-1/2 transform -translate-x-1/2 sm:static sm:transform-none"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Customize;
