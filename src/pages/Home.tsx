import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-row gap-5 p-10 text-lg ">
            <Link
                to={"/image-packer"}
                className="text-blue-500 hover:underline"
            >
                Image Packer
            </Link>
        </div>
    );
};

export default Home;
