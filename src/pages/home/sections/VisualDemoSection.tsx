import React from "react";

const VisualDemoSection: React.FC = () => {
    return (
        <section className="my-10 text-center">
            <h2 className="text-2xl font-bold text-secondary-900">See Pack4Print in Action</h2>
            <div className="mt-6">
                <img
                    src="FullVideo.gif" // Replace with your actual demo image/GIF URL
                    alt="Pack4Print Demo"
                    className="w-full max-w-lg mx-auto border border-gray-300 rounded-md shadow-md"
                />
    
            </div>
            <p className="mt-4 text-sm text-gray-600">
                Watch as Pack4Print optimizes your images for printing. Try it now and see the difference!
            </p>
        </section>
    );
};

export default VisualDemoSection;
