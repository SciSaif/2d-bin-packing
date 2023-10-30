import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-row gap-5 p-10 text-lg ">
            <Link to={"/algo-test"} className="text-blue-500 hover:underline">
                Algo Test
            </Link>
            <Link
                to={"/image-packer"}
                className="text-blue-500 hover:underline"
            >
                Image Packer
            </Link>
            <Link
                to={"/image-sizing"}
                className="text-blue-500 hover:underline"
            >
                Image Sizing
            </Link>
        </div>
    );
};

export default Home;
