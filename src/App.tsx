import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImagePacker from "./pages/home/ImagePacker";
import Footer from "./components/Footer";
import Header from "./components/Header";

// wrapper with Header and Footer
const w = (Component: React.FC) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow ">
                <Component />
            </div>
            <Footer />
        </div>
    );
};

const App = () => {
    return (
        <div className="min-h-screen bg-bg">
            <Router>
                <Routes>
                    <Route path="/" element={w(ImagePacker)} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
