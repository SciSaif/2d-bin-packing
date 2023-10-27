import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlgoTest from "./pages/AlgoTest";
import ImagePacker from "./pages/ImagePacker";
import Home from "./pages/Home";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/algo-test" element={<AlgoTest />} />
                <Route path="/image-packer" element={<ImagePacker />} />
            </Routes>
        </Router>
    );
};

export default App;
