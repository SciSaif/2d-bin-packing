import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Pack from "./pages/pack/Pack";

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
        <div className="w-full min-h-screen   bg-yellow-50/20   bg-grid-small-black/[0.2] ">
            <Router>
                <Routes>
                    <Route path="/" element={w(Home)} />
                    <Route path="/about" element={w(About)} />
                    <Route path="/pack" element={w(Pack)} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
