"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const BASE_URL = "http://52.172.219.28/back";

function Cell({ color }) {
    return (
        <div
            className={`bg-${color} border-r-[1px] border-b-[1px] border-black`}
        ></div>
    );
}

export default function Home() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    const [rows,setRows] = useState(0);
    const [cols,setCols] = useState(0);
    const [color, setColor] = useState("white");
    const divRef = useRef(null);
    const keyMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
    };

    const [error, setError] = useState(null);

    async function fetchGrid() {
        const res = await fetch(`${BASE_URL}/board_settings/`);
        const data = await res.json();
        setRows(data['rows']);
        setCols(data['cols']);
    }

    async function reset() {
        const res = await fetch(`${BASE_URL}/reset_camera/`, {
            method: "POST",
        });

        
    }

    async function initialize() {
        await fetchGrid();

        setInterval(() => {
            fetch(`${BASE_URL}/movement/`).then((res) => {
                res.json().then((data) => {
                    let row = data["current_position"][0];
                    let col = data["current_position"][1];
                    setColor(data["color"]);
                    setPosition({
                        x: row,
                        y: col,
                    });
                });
            });
        }, 1000);
    }

    useEffect(() => {
        initialize();

        if (divRef.current) {
            divRef.current.focus();
        }
    }, []);

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
            }).then((res) => {
                if (res.status === 400) {
                    res.json().then((data) => {
                        setError(data["message"]);
                    });
                } else {
                    setError(null);
                }
            });
        }
    };

    return (
        <div
            className='h-screen w-screen bg-gray-200 p-4 flex flex-col items-center'
            ref={divRef}
            tabIndex='0'
            onKeyUp={handleKeyPress}
        >   
            <div className=" flex flex-row justify-between w-1/2 p-2 mx-auto">
                <h1 className='text-4xl text-center text-black'>
                    Camera Mover
                </h1>
                <div className="w-fit border-red-500 rounded-md p-2 border-2 hover:bg-red-500 hover:text-white cursor-pointer text-red-500" onClick={reset}>
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
                {new Array(rows).fill(0).map((row, rowIndex) =>
                    new Array(cols).fill(0).map((cell, cellIndex) => (
                        <div
                            key={`${rowIndex}-${cellIndex}`}
                            style={{
                                backgroundColor: rowIndex === position.y && cellIndex === position.x ? color : "white",
                                borderRight : "1px solid black",
                                borderBottom : "1px solid black",
                            }}
                        >
                        </div>
                    ))
                )}
            </div>
            {error && (
                <p className='text-red-500'>{error}</p>
            )}
        </div>
    );
}
