"use client";
import { useEffect, useState, useRef } from "react";

const BASE_URL = "http://52.172.219.28/back";
// const BASE_URL = "http://localhost:8000";

export default function Home() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);
    const [color, setColor] = useState("white");
    const [grid, setGrid] = useState([]);
    const [error, setError] = useState(null);
    const divRef = useRef(null);
    const intervalRef = useRef(null);

    const keyMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
    };

    // Reset camera
    async function reset() {
        try {
            await fetch(`${BASE_URL}/reset_camera/`, { method: "POST" });
            const newGrid = Array.from({ length: cols }, () =>
                Array(rows).fill("white")
            );
            setGrid(newGrid);

        } catch (err) {
            console.error("Error resetting camera:", err);
        }
    }

    // Fetch grid settings and initialize the grid
    async function fetchGrid() {
        try {
            const res = await fetch(`${BASE_URL}/board_settings/`);
            const data = await res.json();

            const newRows = data.rows;
            const newCols = data.cols;
            setRows(newRows);
            setCols(newCols);

            const newGrid = Array.from({ length: newCols }, () =>
                Array(newRows).fill("white")
            );
            setGrid(newGrid);
        } catch (err) {
            console.error("Error fetching grid settings:", err);
        }
    }

    // Fetch movement updates and update the grid
    async function fetchMovement() {
        try {
            const res = await fetch(`${BASE_URL}/movement/`);
            const data = await res.json();

            const [row, col] = data.current_position;

            setColor(data.color);
            setPosition({ x: row, y: col });

            // Update grid with new position and color
            setGrid((prevGrid) => {
                if (!prevGrid || !prevGrid[col] || !prevGrid[col][row]) return prevGrid;

                const newGrid = prevGrid.map((r) => r.slice());
                newGrid[col][row] = data.color;
                return newGrid;
            });
        } catch (err) {
            console.error("Error fetching movement data:", err);
        }
    }

    // Initialize the app
    async function initialize() {
        await fetchGrid();

        // Start movement polling
        intervalRef.current = setInterval(fetchMovement, 1000);
    }

    // Clean up interval on component unmount
    useEffect(() => {
        initialize();

        if (divRef.current) {
            divRef.current.focus();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Handle key presses
    const handleKeyPress = (e) => {
        if (keyMap[e.key]) {
            fetch(`${BASE_URL}/movement/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    x: keyMap[e.key][0],
                    y: keyMap[e.key][1],
                }),
            })
                .then((res) => {
                    if (res.status === 400) {
                        res.json().then((data) => setError(data.message));
                    } else {
                        setError(null);
                    }
                })
                .catch((err) => console.error("Error sending movement data:", err));
        }
    };

    return (
        <div
            className="h-screen w-screen bg-gray-200 p-4 flex flex-col items-center"
            ref={divRef}
            tabIndex="0"
            onKeyUp={handleKeyPress}
        >
            <div className="flex flex-row justify-between w-1/2 p-2 mx-auto">
                <h1 className="text-4xl text-center text-black">Camera Mover</h1>
                <div
                    className="w-fit border-red-500 rounded-md p-2 border-2 hover:bg-red-500 hover:text-white cursor-pointer text-red-500"
                    onClick={reset}
                >
                    Reset
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, auto)`,
                    gridTemplateRows: `repeat(${rows}, auto)`,
                    border: "2px solid black",
                    width: "80vh",
                    height: "80vh",
                }}
            >
                {grid.map((col, colIndex) =>
                    col.map((cellColor, rowIndex) => (
                        <div
                            key={`${colIndex}-${rowIndex}`}
                            style={{
                                backgroundColor: cellColor,
                                borderRight: "1px solid black",
                                borderBottom: "1px solid black",
                            }}
                        ></div>
                    ))
                )}
            </div>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
