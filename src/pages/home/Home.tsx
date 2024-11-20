import React from "react";
import HeroSection from "./sections/HeroSection";
import HowItWorks from "./sections/HowItWorks";
import FeaturesSection from "./sections/FeaturesSection";
import VisualDemoSection from "./sections/VisualDemoSection";

const Home: React.FC = () => {
    return (
        <main className="flex flex-col pb-10 gap-2 px-2 py-2 mx-auto max-w-[1050px] items-center">
            <HeroSection />
            <HowItWorks />
            <FeaturesSection />
            <VisualDemoSection />
        </main>
    );
};

export default Home;
