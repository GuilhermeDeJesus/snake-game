import React, { useEffect, useState } from "react";

export default function RankingBoard() {
  const [scores, setScores] = useState([]);
  const [lastPlayer, setLastPlayer] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("lastPlayer");
    setLastPlayer(storedName);
    localStorage.removeItem("lastPlayer"); 

    fetch("http://localhost:3000/scores")
      .then((res) => res.json())
      .then((data) => setScores(data))
      .catch((err) => console.error("Erro ao carregar ranking:", err));
  }, []);

  return (
    <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-4 shadow-lg border border-yellow-400">
    <h2 className="text-xl font-bold text-yellow-300 mb-3 text-center">
        🏆 Top 10 Jogadores
    </h2>
    <ul className="space-y-2">
        {scores.map((entry, index) => {
        const isNew = entry.name === lastPlayer;
        return (
            <li
            key={index}
            className={`flex justify-between px-3 py-1 rounded text-sm md:text-base ${
                isNew
                ? "bg-green-600 animate-pulse ring-2 ring-green-300"
                : "bg-gray-700"
            }`}
            >
            <span className="text-white font-medium">
                #{index + 1} {entry.name}
            </span>
            <span className="text-green-300 font-bold">{entry.score}</span>
            </li>
        );
        })}
    </ul>
    </div>
  );
}
