import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-10 text-center">
            <h1 className="mb-2 text-xl font-bold text-secondary-900 sm:text-2xl">
                Save Paper, Save Time: Pack Images Like a Pro!
            </h1>
            <p className="text-lg">
                Effortlessly optimize your image layouts for printing. Upload your photos, let our smart algorithm pack them tightly, and save pages instantly — all for free!
            </p>

            <img src="hero_with_bg.png" alt="hero" className="w-full max-w-lg mt-8" />

            <Link
                to={"/modeSelection"}
                className="px-8 py-2 mt-10 font-bold text-white transition duration-200 border-2 border-transparent rounded-md bg-secondary-700 w-fit hover:bg-white hover:text-secondary-700 hover:border-secondary-700"
            >
                Let's go!
            </Link>

        </div>
    );
};

export default HeroSection;
