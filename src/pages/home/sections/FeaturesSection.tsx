import React from "react";

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: "Efficient Packing",
            description: "Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Custom Layout Options",
            description: "Switch between automatic and manual modes for flexibility. Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Save as PDF or Print",
            description: "Export your layouts or print directly from your desktop. Automatically arrange images to save paper and reduce waste. Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Drag-and-Drop Simplicity",
            description: "Upload images quickly or paste directly with Ctrl+V. Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Resizing & Cropping",
            description: "Resize images to fit paper or standard photo sizes like passport or visa. Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Completely Free",
            description: "No hidden costs, no subscriptions — just smarter printing. Automatically arrange images to save paper and reduce waste.",
        },
    ];

    return (
        <section className="my-10">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                {features.map((feature, index) => (
                    <div key={index} className="relative flex flex-col">
                        {/* Large Number */}
                        <div className="text-gray-200 text-5xl font-bold mb-4 text-left">
                            {index + 1}.
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-green-700 text-left">{feature.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 text-left">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
