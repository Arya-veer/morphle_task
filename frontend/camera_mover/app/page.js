"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Home() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    const [color, setColor] = useState("white");
    const divRef = useRef(null);
    const keyMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        setInterval(() => {
            fetch("http://52.172.219.28/back/movement/").then(
                (res) => {
                    res.json().then((data) => {
                        setPosition({
                            x: data["current_position"][0],
                            y: data["current_position"][1],
                        });
                        setColor(data["color"]);
                    });
                }
            );
        }, 1000);

        if (divRef.current) {
            divRef.current.focus();
        }
    }, []);

    const handleKeyPress = (e) => {
        if (keyMap[e.key]) {
            fetch(`http://52.172.219.28/back/movement/`, {
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
            <h1 className='text-4xl text-center text-black'>
                Camera Mover
            </h1>
            {error && (
                <p className='text-red-500'>{error}</p>
            )}
            <div className='relative w-1/2 h-1/2 mx-auto bg-white border-2 border-black'>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(${
                            position.x * 10
                        }px, ${position.y * 10}px)`,
                        width: 10,
                        height: 10,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
        </div>
    );
}
