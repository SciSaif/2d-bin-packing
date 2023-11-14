import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [hideLetters, setHideLetters] = useState(false);

    const hoverTimer = useRef<any>();
    const hoverAnimationDelay = useRef<any>();
    const handleMouseEnter = () => {
        // Set a timeout for 100ms before starting the hover animation
        hoverAnimationDelay.current = setTimeout(() => {
            setIsHovering(true);
            // Set a timeout for 1 second to hide ACK
            hoverTimer.current = setTimeout(() => {
                setHideLetters(true);
            }, 650);
        }, 100);
    };

    const handleMouseLeave = () => {
        // Clear both timeouts if the mouse leaves before 100ms or 1 second
        clearTimeout(hoverAnimationDelay.current);
        clearTimeout(hoverTimer.current);
        setIsHovering(false);
        setHideLetters(false); // Reset hideACK when not hovering
    };
    return (
        <div className="flex justify-center py-2 md:py-5 bg-secondary">
            <div
                className="flex items-center justify-center text-2xl font-bold text-white cursor-pointer md:text-7xl gap-x-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {!hideLetters && (
                    // This is a hack to make the text centered
                    <span className="opacity-0 w-[7px] h-full"></span>
                )}
                <span className="letter">P</span>

                {!hideLetters &&
                    ["a", "c", "k"].map((letter, index) => (
                        <span
                            key={index}
                            className={`letter ${
                                isHovering ? "fade-out" : "fade-in"
                            }`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {letter}
                        </span>
                    ))}
                <span className="text-6xl text-primary md:text-9xl">4</span>
                <span className="letter">P</span>
                {!hideLetters &&
                    ["r", "i", "n", "t"].map((letter, index) => (
                        <span
                            key={index}
                            className={`letter ${
                                isHovering ? "fade-out" : "fade-in"
                            }`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {letter}
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default Header;
