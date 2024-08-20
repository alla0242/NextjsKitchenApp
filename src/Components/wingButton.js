"use client";
import React, { useState, useEffect } from "react";

const table = [
  { name: "Bar1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar3", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar4", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar5", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar6", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Bar7", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "PonyBar1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "PonyBar2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "PonyBar3", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "PonyBar4", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Vip1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Vip2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "CornerHitop", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "FrontTable", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Hitop1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Hitop2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Wall1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Wall2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "Wall3", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "BackTable1", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "BackTable2", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
  { name: "BackTable3", seat1: [], seat2: [], seat3: [], seat4: [], seat5: [], seat6: [], seat7: [], seat8: [], seat9: [], seat10: [] },
];

const sauce = [
  { name: "Plain" },
  { name: "Salt & Pepper" },
  { name: "Cajun" },
  { name: "Lemon Pepper" },
  { name: "Salt&Vinegar" },
  { name: "Mild" },
  { name: "Medium" },
  { name: "Hot" },
  { name: "Suicide" },
  { name: "Honey Garlic" },
  { name: "Honey Hot" },
  { name: "Sweet Thai" },
  { name: "Jerk" },
];

const side = [
  { name: "Sour Cream", quantity: 0 },
  { name: "Ranch", quantity: 0 },
  { name: "Blue Cheese", quantity: 0 },
  { name: "Mild", quantity: 0 },
  { name: "Medium", quantity: 0 },
  { name: "Hot", quantity: 0 },
  { name: "Suicide", quantity: 0 },
  { name: "Honey Garlic", quantity: 0 },
  { name: "Honey Hot", quantity: 0 },
  { name: "Sweet Thai", quantity: 0 },
  { name: "Jerk", quantity: 0 },
];

const specialInstructions = [
  { name: "Well Done" },
  { name: "Light Sauce" },
  { name: "Heavy Sauce" },
  { name: "Unbreaded" },
];

const WingButton = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [totalWings, setTotalWings] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedSpecialInstructions, setSelectedSpecialInstructions] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [currentSeat, setCurrentSeat] = useState(1);
  const [seatSummaries, setSeatSummaries] = useState({});
  const [tableSummary, setTableSummary] = useState({
    totalWings: 0,
    sauces: [],
    sides: [],
    specialInstructions: []
  });

  useEffect(() => {
    const newSeatSummary = {
      totalWings,
      sauces: selectedSauces,
      sides: selectedSides.map(side => `${side.quantity}x ${side.name}`),
      specialInstructions: selectedSpecialInstructions
    };

    setSeatSummaries(prev => ({
      ...prev,
      [`seat${currentSeat}`]: newSeatSummary
    }));
  }, [totalWings, selectedSauces, selectedSides, selectedSpecialInstructions, currentSeat]);

  useEffect(() => {
    const aggregatedSummary = Object.values(seatSummaries).reduce(
      (acc, seat) => {
        acc.totalWings += seat.totalWings;
        acc.sauces = [...acc.sauces, ...seat.sauces];
        acc.sides = [...acc.sides, ...seat.sides];
        acc.specialInstructions = [...acc.specialInstructions, ...seat.specialInstructions];
        return acc;
      },
      { totalWings: 0, sauces: [], sides: [], specialInstructions: [] }
    );

    setTableSummary(aggregatedSummary);
  }, [seatSummaries]);

  const addWings = (amount) => {
    setTotalWings(totalWings + amount);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSetName = () => {
    setSelectedTable({ name: inputValue });
  };

  const handleAddCustomInstruction = () => {
    if (inputValue.trim() !== "") {
      setSelectedSpecialInstructions(prev => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  const toggleSide = (side) => {
    setSelectedSides(prevSelectedSides => {
      if (prevSelectedSides.some(s => s.name === side.name)) {
        return prevSelectedSides.map(s =>
          s.name === side.name ? { ...s, quantity: 0 } : s
        ).filter(s => s.quantity > 0);
      } else {
        return [...prevSelectedSides, { ...side, quantity: 1 }];
      }
    });
  };

  const incrementSide = (sideName) => {
    setSelectedSides(prevSelectedSides =>
      prevSelectedSides.map(s =>
        s.name === sideName ? { ...s, quantity: s.quantity + 1 } : s
      )
    );
  };

  const decrementSide = (sideName) => {
    setSelectedSides(prevSelectedSides =>
      prevSelectedSides
        .map(s => s.name === sideName && s.quantity > 0 ? { ...s, quantity: s.quantity - 1 } : s)
        .filter(s => s.quantity > 0)
    );
  };

  const toggleSpecialInstruction = (instruction) => {
    setSelectedSpecialInstructions(prevSelectedSpecialInstructions => {
      if (prevSelectedSpecialInstructions.includes(instruction)) {
        return prevSelectedSpecialInstructions.filter(i => i !== instruction);
      } else {
        return [...prevSelectedSpecialInstructions, instruction];
      }
    });
  };

  const toggleSauce = (sauce) => {
    setSelectedSauces(prevSelectedSauces => {
      if (prevSelectedSauces.includes(sauce)) {
        return prevSelectedSauces.filter(s => s !== sauce);
      } else {
        return [...prevSelectedSauces, sauce];
      }
    });
  };

  const handleNextSeat = () => {
    setCurrentSeat(prevSeat => (prevSeat < 10 ? prevSeat + 1 : 1));
    setTotalWings(0);
    setSelectedSauces([]);
    setSelectedSides([]);
    setSelectedSpecialInstructions([]);
  };

  return (
    <>
      {!selectedTable && (
        <div id="table">
          {table.map((table) => (
            <div key={table.name}>
              <button
                onClick={() => setSelectedTable(table)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                {table.name}
              </button>
            </div>
          ))}
          <div>
            <label>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inputValue}
              onChange={handleInputChange}
            ></input>
            <button onClick={handleSetName}>Set Name</button>
          </div>
          <button>Next Screen</button>
        </div>
      )}

      <div id="quantity">
        <button onClick={() => addWings(4)}>Half pound</button>
        <button onClick={() => addWings(8)}>Full pound</button>
        <h2>You're sending {totalWings} wings to the kitchen</h2>
        <button>Next Screen</button>
      </div>

      <div id="sauce">
        <h1>Select Sauce</h1>
        {sauce.map((sauce) => (
          <button
            key={sauce.name}
            onClick={() => toggleSauce(sauce.name)}
            className={`py-2 px-4 rounded ${
              selectedSauces.includes(sauce.name)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {sauce.name}
          </button>
        ))}
        <h2>
          You're adding {selectedSauces.join(", ")} sauces to these {totalWings}{" "}
          wings
        </h2>
        <button>Next Screen</button>
      </div>
      <div id="side">
        <h1>Any Sides?</h1>
        {side.map((side) => (
          <div key={side.name}>
            <button
              onClick={() => toggleSide(side)}
              className={`py-2 px-4 rounded ${
                selectedSides.some((s) => s.name === side.name)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {side.name}
            </button>
            {selectedSides.some((s) => s.name === side.name) && (
              <div>
                <button onClick={() => decrementSide(side.name)}>-</button>
                <span>
                  {selectedSides.find((s) => s.name === side.name).quantity}
                </span>
                <button onClick={() => incrementSide(side.name)}>+</button>
              </div>
            )}
          </div>
        ))}
        <h2>
          You're adding{" "}
          {selectedSides
            .map((side) => `${side.quantity}x ${side.name} `)
            .join(", ")}{" "}
          sides to the kitchen
        </h2>
        <button>Next Screen</button>
      </div>
      <div id="Speical">
        <h1>Special Instructions</h1>
        {specialInstructions.map((instruction) => (
          <button
            key={instruction.name}
            onClick={() => toggleSpecialInstruction(instruction.name)}
            className={`py-2 px-4 rounded ${
              selectedSpecialInstructions.includes(instruction.name)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {instruction.name}
          </button>
        ))}
        <label>Custom Special Instructions</label>
        <input
          type="text"
          id="instructions"
          name="instructions"
          value={inputValue}
          onChange={handleInputChange}
        ></input>
        <button onClick={handleAddCustomInstruction}>
          Add Custom Instruction
        </button>
        <h2>
          Special Instructions:
          {selectedSpecialInstructions.join(", ")}
        </h2>
        <button>More Wings</button>
        <button>Next Screen</button>
      </div>
      <div id="seatSummary">
        <h2>Seat {currentSeat} Summary</h2>
        <p>
          <strong>Total Wings:</strong> {totalWings}
        </p>
        <p>
          <strong>Sauces:</strong> {selectedSauces.join(", ")}
        </p>
        <p>
          <strong>Sides:</strong>{" "}
          {selectedSides
            .map((side) => `${side.quantity}x ${side.name}`)
            .join(", ")}
        </p>
        <p>
          <strong>Special Instructions:</strong>{" "}
          {selectedSpecialInstructions.join(", ")}
        </p>
        <button onClick={handleNextSeat}>Next Seat</button>
      </div>
      <div id="tableSummary">
        <h2>Table Summary</h2>
        <p>
          <strong>Total Wings:</strong> {tableSummary.totalWings}
        </p>
        <p>
          <strong>Sauces:</strong> {tableSummary.sauces.join(", ")}
        </p>
        <p>
          <strong>Sides:</strong> {tableSummary.sides.join(", ")}
        </p>
        <p>
          <strong>Special Instructions:</strong>{" "}
          {tableSummary.specialInstructions.join(", ")}
        </p>
        <h3>Seat Details:</h3>
        {Object.entries(seatSummaries).map(([seat, summary], index) => (
          <div key={index}>
            <h4>{seat}</h4>
            <p>
              <strong>Total Wings:</strong> {summary.totalWings}
            </p>
            <p>
              <strong>Sauces:</strong> {summary.sauces.join(", ")}
            </p>
            <p>
              <strong>Sides:</strong> {summary.sides.join(", ")}
            </p>
            <p>
              <strong>Special Instructions:</strong>{" "}
              {summary.specialInstructions.join(", ")}
            </p>
            <button>Edit Seat</button>
          </div>
        ))}
        <button>Edit Order</button>
        <button>Confirm Order</button>
      </div>
      <div id="sendToKitchen">
        <h2>Confirm Order</h2>
        <button>Send To Kitchen</button>
      </div>
    </>
  );
};

export default WingButton;