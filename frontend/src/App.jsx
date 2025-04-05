import React, { useState } from "react";
import RankingBoard from "./components/RankingBoard";
import GameBoard from "./components/GameBoard";

export default function App() {
  const [mode, setMode] = useState("normal");

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const speedMultiplier = mode === "hard" ? 0.6 : 1;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-green-400">🐍 Snake Game</h1>

      <div className="mb-6 flex items-center gap-2">
        <label htmlFor="mode" className="text-sm text-gray-300">
          Modo de Jogo:
        </label>
        <select
          id="mode"
          value={mode}
          onChange={handleModeChange}
          className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
        >
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        <GameBoard speedMultiplier={speedMultiplier} />
        <RankingBoard />
      </div>
    </div>
  );
}
