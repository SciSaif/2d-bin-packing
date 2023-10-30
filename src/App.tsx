import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlgoTest from "./pages/AlgoTest";
import ImagePacker from "./pages/ImagePacker";
import Home from "./pages/Home";
import Footer from "./components/Footer";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/algo-test" element={<AlgoTest />} />
                    <Route path="/image-packer" element={<ImagePacker />} />
                </Routes>
            </Router>
            <Footer />
        </div>
    );
};

export default App;
