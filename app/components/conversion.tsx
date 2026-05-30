import React, { useState } from "react";
import { text } from "stream/consumers";

const Conversion = () => {
  const [mode, setMode] = useState("lb-kg");
  const [leftInput, setLeftInput] = useState(0);
  const [rightInput, setRightInput] = useState(0);

  const [inputArray, setInputArray] = useState<number[]>([]);
  const [outputArray, setOutputArray] = useState<number[]>([]);

  //left if true (default), right if false
  const [arrayHandlerModeIsLeft, setArrayHandlerModeIsLeft] = useState(true);

  function singleItemConverter() {
    leftInput !== 0
      ? setRightInput(
          mode === "lb-kg"
            ? leftInput * 0.453592
            : mode === "m-ft"
              ? leftInput * 3.28084
              : (leftInput - 32) / 1.8,
        )
      : setLeftInput(
          mode === "lb-kg"
            ? rightInput / 0.453592
            : mode === "m-ft"
              ? rightInput / 3.28084
              : rightInput * 1.8 + 32,
        );
  }

  function arrayConverter() {
    // this looks like it should not work but yet it does
    setOutputArray(
      inputArray.map((item: number) =>
        mode === "lb-kg"
          ? arrayHandlerModeIsLeft
            ? item * 0.453592
            : item / 0.453592
          : mode === "m-ft"
            ? arrayHandlerModeIsLeft
              ? item * 3.28084
              : item / 3.28084
            : arrayHandlerModeIsLeft
              ? (item - 32) / 1.8
              : item * 1.8 + 32,
      ),
    );
  }

  return (
    <div>
      <header>
        <h1 className="text-2xl font-semibold text-center my-5">
          Welcome to my unit conversion web page
        </h1>
        <span className="flex justify-center rounded-2xl bg-gray-200 mx-5">
          <button
            onClick={() => setMode("lb-kg")}
            //use same variable for color change, actual mode setting and because these are tied, unselected buttons automaticly change colors to the default
            className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "lb-kg" ? "bg-gray-900" : "bg-gray-500"}`}
          >
            Lb-Kg
          </button>
          <button
            onClick={() => setMode("m-ft")}
            className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "m-ft" ? "bg-gray-900" : "bg-gray-500"}`}
          >
            M-Ft
          </button>
          <button
            onClick={() => setMode("c-f")}
            className={`m-5 p-3 rounded-2xl text-white hover:bg-gray-700 transition-colors ${mode === "c-f" ? "bg-gray-900" : "bg-gray-500"}`}
          >
            C-F
          </button>
        </span>
      </header>
      <section className="rounded-2xl bg-gray-200 mx-5 my-5 flex justify-center flex-col">
        <h2 className="font-bold capitalize text-center pt-5">{mode}</h2>

        <form
          className="flex justify-center"
          onSubmit={(e) => {
            // Stops page from refreshing
            e.preventDefault();

            // This is a very complicated nested if else but understandable with a little bit of pain.

            inputArray.length === 0 ? singleItemConverter() : arrayConverter();
          }}
        >
          <input
            value={leftInput}
            type="number"
            //no idea what e.target.value is but essensially it gets a value from my input somehow. Sets right input to zero when changing left
            onChange={(e) => {
              setLeftInput(Number(e.target.value));
              setRightInput(0);
            }}
            className="m-5 border rounded-xl border-gray-500 p-2 text-center"
          />

          <input
            value={rightInput}
            type="number"
            onChange={(e) => {
              setRightInput(Number(e.target.value));
              setLeftInput(0);
            }}
            className="m-5 border rounded-xl border-gray-500 p-2 text-center"
          />
          <button
            type="submit"
            className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
          >
            Calculate
          </button>
        </form>
        {/* array handling */}

        <span className="flex justify-center">
          {/* Had to implement last minute, so it looks ugly */}
          <button
            className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
            onClick={() => {
              setInputArray((prev) => [
                ...inputArray,
                arrayHandlerModeIsLeft ? leftInput : rightInput,
              ]);
            }}
          >
            Add value to an array
          </button>
          <button
            className="bg-gray-500 m-5 p-3 rounded-2xl text-white hover:bg-gray-700"
            onClick={() => setInputArray([])}
          >
            Clear array
          </button>
          {/* Im tired so I will do it the easy way: lefr is green, right if grey. At least I will make it diasble itself if the array is not epmty so i dont need to implement different units in one array */}
          <button
            className={`m-5 p-3 rounded-2xl text-white ${arrayHandlerModeIsLeft ? "bg-green-500" : "bg-gray-500"}`}
            onClick={() => setArrayHandlerModeIsLeft(!arrayHandlerModeIsLeft)}
            disabled={inputArray.length !== 0 ? true : false}
          >
            Left
          </button>
        </span>
        <span className="flex flex-col text-center">
          <p>input array: {inputArray.join(", ")}</p>

          <p>output array: {outputArray.join(", ")}</p>
        </span>
      </section>
    </div>
  );
};

export default Conversion;
