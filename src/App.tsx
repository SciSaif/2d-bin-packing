import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import About from "./pages/about/About";

// wrapper with Header and Footer
const w = (Component: React.FC) => {
    console.log('hiiii')
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
                    <Route path="/" element={w(Home)} />
                    <Route path="/about" element={w(About)} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
