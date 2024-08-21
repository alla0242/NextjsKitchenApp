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
  const [wingDetails, setWingDetails] = useState([]);

  useEffect(() => {
    const aggregatedSummary = Object.values(seatSummaries).flat().reduce(
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
    const newWingDetail = {
      totalWings,
      sauces: selectedSauces,
      sides: selectedSides,
      specialInstructions: selectedSpecialInstructions
    };
    setWingDetails([newWingDetail]); // Reset wingDetails to start orders from 1

    const newSeatSummary = {
      totalWings,
      sauces: selectedSauces,
      sides: selectedSides.map(side => `${side.quantity}x ${side.name}`),
      specialInstructions: selectedSpecialInstructions
    };

    setSeatSummaries(prev => ({
      ...prev,
      [`seat${currentSeat}`]: [...(prev[`seat${currentSeat}`] || []), newSeatSummary]
    }));

    setCurrentSeat(prevSeat => (prevSeat < 10 ? prevSeat + 1 : 1));
    setTotalWings(0);
    setSelectedSauces([]);
    setSelectedSides([]);
    setSelectedSpecialInstructions([]);
  };

  const handleMoreWings = () => {
    const newWingDetail = {
      totalWings,
      sauces: selectedSauces,
      sides: selectedSides,
      specialInstructions: selectedSpecialInstructions
    };
    setWingDetails(prev => [...prev, newWingDetail]); // Add new order at the start
    console.log("Wing order added:", newWingDetail);
    setTotalWings(0);
    setSelectedSauces([]);
    setSelectedSides([]);
    setSelectedSpecialInstructions([]);
  };

  const handleSaveWings = () => {
    console.log("handleSaveWings called");
    console.log("Current wingDetails:", wingDetails);

    const aggregatedWingDetail = wingDetails.reduce(
      (acc, detail) => {
        acc.totalWings += detail.totalWings;
        acc.sauces = [...acc.sauces, ...detail.sauces];
        acc.sides = [...acc.sides, ...detail.sides];
        acc.specialInstructions = [...acc.specialInstructions, ...detail.specialInstructions];
        return acc;
      },
      { totalWings: 0, sauces: [], sides: [], specialInstructions: [] }
    );

    console.log("Aggregated wing detail:", aggregatedWingDetail);

    setWingDetails([aggregatedWingDetail]); // Save only one aggregated order
    console.log("Wing details after setting:", [aggregatedWingDetail]);

    const newSeatSummary = {
      totalWings: aggregatedWingDetail.totalWings,
      sauces: aggregatedWingDetail.sauces,
      sides: aggregatedWingDetail.sides.map(side => `${side.quantity}x ${side.name}`),
      specialInstructions: aggregatedWingDetail.specialInstructions
    };

    setSeatSummaries(prev => ({
      ...prev,
      [`seat${currentSeat}`]: [...(prev[`seat${currentSeat}`] || []), newSeatSummary]
    }));

    setTotalWings(0);
    setSelectedSauces([]);
    setSelectedSides([]);
    setSelectedSpecialInstructions([]);
    console.log("State reset after saving wings");
  };

  return (
    <div className="p-4">
      {!selectedTable && (
        <div id="table" className="space-y-4">
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
          <div className="space-y-2">
            <label className="block">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inputValue}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
            <button
              onClick={handleSetName}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Set Name
            </button>
          </div>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700">
            Next Screen
          </button>
        </div>
      )}

      <div id="quantity" className="space-y-4">
        <button
          onClick={() => addWings(4)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Half pound
        </button>
        <button
          onClick={() => addWings(8)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Full pound
        </button>
        <h2 className="text-lg">
          You're sending {totalWings} wings to the kitchen
        </h2>

        <h1 className="text-xl">Select Sauce</h1>
        <div className="space-y-2">
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
        </div>

        <h1 className="text-xl">Any Sides?</h1>
        <div className="space-y-2">
          {side.map((side) => (
            <div key={side.name} className="space-y-2">
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decrementSide(side.name)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                  >
                    -
                  </button>
                  <span>
                    {selectedSides.find((s) => s.name === side.name).quantity}
                  </span>
                  <button
                    onClick={() => incrementSide(side.name)}
                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-xl">Special Instructions</h1>
        <div className="space-y-2">
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
        </div>
        <div className="space-y-2">
          <label className="block">Custom Special Instructions</label>
          <input
            type="text"
            id="instructions"
            name="instructions"
            value={inputValue}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleAddCustomInstruction}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Custom Instruction
          </button>
        </div>

        <h2 className="text-lg">
          {totalWings} {selectedSpecialInstructions.join(", ")} wings with{" "}
          {selectedSauces.join(", ")} and{" "}
          {selectedSides
            .map((side) => `${side.quantity}x ${side.name}`)
            .join(", ")}{" "}
          sides
        </h2>

        <button
          onClick={handleMoreWings}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
        >
          More Wings
        </button>
        <button
          onClick={handleSaveWings}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
          id="saveWings"
        >
          Save Wings
        </button>
      </div>

      <div id="seatSummary" className="space-y-4">
        <h2 className="text-xl">Seat {currentSeat} Summary</h2>
        {wingDetails.map((detail, index) => (
          <div key={index} className="space-y-2">
            <p>
              <strong>Order {index + 1}:</strong>
            </p>
            <p>
              <strong>Total Wings:</strong> {detail.totalWings}
            </p>
            <p>
              <strong>Sauces:</strong> {detail.sauces.join(", ")}
            </p>
            <p>
              <strong>Sides:</strong>{" "}
              {detail.sides.map((side) => `${side.quantity}x ${side.name}`).join(", ")}
            </p>
            <p>
              <strong>Special Instructions:</strong>{" "}
              {detail.specialInstructions.join(", ")}
            </p>
          </div>
        ))}
        <button
          onClick={handleNextSeat}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Next Seat
        </button>
      </div>

      <div id="tableSummary" className="space-y-4">
        <h2 className="text-xl">Table Summary</h2>
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
        <h3 className="text-lg">Seat Details:</h3>
        {Object.entries(seatSummaries).map(([seat, summaries], index) => (
          <div
            key={index}
            className={`space-y-2 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
            } p-2 rounded`}
          >
            <h4 className="text-lg">{seat}</h4>
            {summaries.map((summary, idx) => (
              <div key={idx} className="space-y-2">
                <p>
                  <strong>Order {idx + 1}:</strong>
                </p>
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
              </div>
            ))}
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Edit Seat
            </button>
          </div>
        ))}
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700">
          Edit Order
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
          Confirm Order
        </button>
      </div>

      <div id="sendToKitchen" className="space-y-4">
        <h2 className="text-xl">Confirm Order</h2>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
          Send To Kitchen
        </button>
      </div>
    </div>
  );
};

export default WingButton;