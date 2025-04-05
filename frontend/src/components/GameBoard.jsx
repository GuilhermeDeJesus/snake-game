import React, { useEffect, useState, useRef } from "react";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = [0, 1];

const eatSound = new Audio("/sounds/eating-sound-effect-36186.mp3");
const backgroundMusic = new Audio("/sounds/background-music-pa-57786.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;


export default function GameBoard({ speedMultiplier = 1 }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const moveInterval = useRef(null);

  const score = snake.length - 1;

  function generateFood() {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    return [x, y];
  }

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setGameOver(false);
  }


  useEffect(() => {
    backgroundMusic.play().catch(() => {});
  }, []);

  useEffect(() => {
    backgroundMusic.muted = isMuted;
  }, [isMuted]);


  useEffect(() => {
    const handleKey = (e) => {

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault(); 
      }
  
      if (gameOver && e.key === "Enter") {
        resetGame();
        return;
      }
      
  
      switch (e.key) {
        case "ArrowUp":
          setDirection((prev) => (prev[0] === 1 ? prev : [-1, 0]));
          break;
        case "ArrowDown":
          setDirection((prev) => (prev[0] === -1 ? prev : [1, 0]));
          break;
        case "ArrowLeft":
          setDirection((prev) => (prev[1] === 1 ? prev : [0, -1]));
          break;
        case "ArrowRight":
          setDirection((prev) => (prev[1] === -1 ? prev : [0, 1]));
          break;
      }
    };
  
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);
  

  useEffect(() => {
    if (gameOver) return;
    const speed = 150 * speedMultiplier;
    moveInterval.current = setInterval(moveSnake, speed);
    return () => clearInterval(moveInterval.current);
  }, [snake, direction, gameOver, speedMultiplier]);

  function moveSnake() {
      let newHead = [
        snake[0][0] + direction[0],
        snake[0][1] + direction[1],
      ];
    

      newHead[0] = (newHead[0] + BOARD_SIZE) % BOARD_SIZE;
      newHead[1] = (newHead[1] + BOARD_SIZE) % BOARD_SIZE;
    
      if (snake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        setGameOver(true);
        clearInterval(moveInterval.current);
        sendScore();
        return;
      }
    
      const newSnake = [newHead, ...snake];
    
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood(generateFood());
        eatSound.play(); 
      } else {
        newSnake.pop();
      }
    
      setSnake(newSnake);
  }

  function sendScore() {
    const name = prompt("Digite seu nome para salvar no ranking:");
    if (!name) return;
  
    fetch("https://snake-game-b8xi.onrender.com/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Pontuação enviada!", data);
        localStorage.setItem("lastPlayer", name); 
      })
      .catch((err) => console.error("Erro ao enviar pontuação:", err));
  }
  

  return (
    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-2xl shadow-2xl border-4 border-green-700 w-full max-w-md">
    {/* Score header */}
    <div className="w-full flex justify-between mb-2 px-2">
        <div className="text-sm md:text-lg">
        Pontuação: <span className="font-bold text-green-300">{score}</span>
        </div>
        <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white"
        >
            {isMuted ? "🔇" : "🔊"}
        </button>
        {gameOver && (
        <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded shadow font-semibold"
        >
            Jogar Novamente
        </button>
        )}
    </div>

    {/* Tabuleiro */}
    <div
        className="grid bg-black border-0, border-white rounded"
        style={{
        gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(16px, 1fr))`,
        gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(16px, 1fr))`,
        width: "100%",
        maxWidth: "400px",
        }}
    >
        {[...Array(BOARD_SIZE)].map((_, row) =>
        [...Array(BOARD_SIZE)].map((_, col) => {
            const isHead = snake[0][0] === row && snake[0][1] === col;
            const isBody = snake.some(([x, y], i) => i !== 0 && x === row && y === col);
            const isFood = food[0] === row && food[1] === col;

            return (
            <div
                key={`${row}-${col}`}
                className={`w-5 h-5 transition-all duration-75 ${
                isHead
                    ? "bg-green-500 rounded"
                    : isBody
                    ? "bg-green-700"
                    : isFood
                    ? "bg-red-500 rounded-full"
                    : "bg-gray-900"
                }`}
            ></div>
            );
        })
        )}
    </div>

    {gameOver && (
        <div className="text-red-500 font-bold mt-3 animate-pulse text-xl">
        Game Over!
        </div>
    )}

    {/* Controles Mobile */}
        <div className="sm:hidden flex flex-col items-center mt-4 gap-2">
            <button
                onClick={() => setDirection((prev) => (prev[0] === 1 ? prev : [-1, 0]))}
                className="bg-gray-700 text-white p-3 rounded focus:outline-none"
            >
                ⬆️
            </button>
            <div className="flex gap-4">
                <button
                onClick={() => setDirection((prev) => (prev[1] === 1 ? prev : [0, -1]))}
                className="bg-gray-700 text-white p-3 rounded focus:outline-none"
                >
                ⬅️
                </button>
                <button
                onClick={() => setDirection((prev) => (prev[1] === -1 ? prev : [0, 1]))}
                className="bg-gray-700 text-white p-3 rounded focus:outline-none"
                >
                ➡️
                </button>
            </div>
            <button
                onClick={() => setDirection((prev) => (prev[0] === -1 ? prev : [1, 0]))}
                className="bg-gray-700 text-white p-3 rounded focus:outline-none"
            >
                ⬇️
            </button>
        </div>
    </div>
  );
}
