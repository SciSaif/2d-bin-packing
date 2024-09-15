import React from "react";

import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <main className="flex flex-col pb-10 gap-2 px-2 py-2 mx-auto max-w-[1050px] items-center">
            <div className="flex flex-col items-center justify-center mt-10 text-center">
                <h1 className="mb-2 text-xl font-bold text-secondary-900 sm:text-2xl">
                    Pack your photos efficiently for printing and save paper!
                </h1>
                <p className="text-lg">
                    Effortlessly optimize your image printing with pack4print!
                    Upload, customize, and let our powerful algorithm
                    intelligently pack your images onto paper, minimizing waste
                    and maximizing efficiency. Create, download, and print with
                    ease. Try it now for a seamless printing experience!
                </p>
                <div>
                    <Link
                        to={"/about"}
                        className="font-semibold underline text-secondary-800 hover:text-secondary-700 hover:underline"
                    >
                        Click here
                    </Link>{" "}
                    for Instructions
                </div>

                <Link
                    to={"/pack"}
                    className="px-8 py-2 mt-10 font-bold text-white transition duration-200 border-2 border-transparent rounded-md bg-secondary-700 w-fit hover:bg-white hover:text-secondary-700 hover:border-secondary-700"
                >
                    Let's go!
                </Link>
            </div>
        </main>
    );
};

export default Home;
