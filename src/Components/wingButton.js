"use client";
import React, { useState } from "react";

const table = [
    {name: "Bar1"},
    {name: "Bar2"},
    {name: "Bar3"},
    {name: "Bar4"},
    {name: "Bar5"},
    {name: "Bar6"},
    {name: "Bar7"},
    {name: "PonyBar1"},
    {name: "PonyBar2"},
    {name: "PonyBar3"},
    {name: "PonyBar4"},
    {name: "Vip1"},
    {name: "Vip2"},
    {name: "CornerHitop"},
    {name: "FrontTable"},
    {name: "Hitop1"},
    {name: "Hitop2"},
    {name: "Wall1"},
    {name: "Wall2"},
    {name: "Wall3"},
    {name: "BackTable1"},
    {name: "BackTable2"},
    {name: "BackTable3"},
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
  { name: "Sour Cream" },
  { name: "Ranch" },
  { name: "Blue Cheese" },
  { name: "Mild" },
  { name: "Medium" },
  { name: "Hot" },
  { name: "Suicide" },
  { name: "Honey Garlic" },
  { name: "Honey Hot" },
  { name: "Sweet Thai" },
  { name: "Jerk" },
];

const specialInstructions = [
    {name: "Well Done"},
    {name: "Light Sauce"},
    {name: "Heavy Sauce"},
];

const order = [
    {table: "", seats: [], wings: "", sauce: [], sides: [], specialInstructions: []}
];

const WingButton = () => {
    const [selectedTable, setSelectedTable] = useState(table);
    const [totalWings, setTotalWings] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [selectedSides, setSelectedSides] = useState([]);

    const addWings = (amount) => {
        setTotalWings(totalWings + amount);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSetName = (table) => {
        const updatedTable = selectedTable.map(t => 
            t.name === table.name ? { ...t, name: inputValue } : t
        );
        setSelectedTable(updatedTable);
    };

    const toggleSide = (side) => {
        setSelectedSides(prevSelectedSides => {
            if (prevSelectedSides.some(s => s.name === side.name)) {
                return prevSelectedSides.filter(s => s.name !== side.name);
            } else {
                return [...prevSelectedSides, side];
            }
        });
    };

    return (
      <>
        <div id="table">
          {selectedTable.map((table) => (
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
            <button onClick={() => handleSetName(table)}>Set Name</button>
          </div>
        </div>
        <div id="Order">
          <h1>Order</h1>
          {/* {order} */}
        </div>

        <div id="quantity">
          <button onClick={() => addWings(4)}>Half pound</button>
          <button onClick={() => addWings(8)}>Full pound</button>
          <h2>You're sending {totalWings} wings to the kitchen</h2>
        </div>

        <div id="sauce">
          <h1>Select Sauce</h1>
          {sauce.map((sauce) => (
            <button key={sauce.name}>{sauce.name}</button>
          ))}
        </div>
        <div id="side">
          <h1>Any Sides?</h1>
          {side.map((side) => (
            <button
              key={side.name}
              onClick={() => toggleSide(side)}
              className={`py-2 px-4 rounded ${selectedSides.some(s => s.name === side.name) ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {side.name}
            </button>
          ))}
          <h2>You're adding {selectedSides.map(side => side.name).join(', ')} sides to the kitchen</h2>
        </div>
        <div id="Speical">
          <h1>Special Instructions</h1>
          {specialInstructions.map((specialInstructions) => (
            <button key={specialInstructions.name}>
              {specialInstructions.name}
            </button>
          ))}
          <label>Custom Special Instructions</label>
          <input
            type="text"
            id="instructions"
            name="name"
            value={inputValue}
            onChange={handleInputChange}
          ></input>
          <button onClick={() => handleSetName(table)}>Set Special Instructions</button>
        </div>
        <div id="SendToKitchen">
          <button>Next Seat</button>
          <button>Send To Kitchen</button>
        </div>
      </>
    );
};

export default WingButton;