import React from "react";

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: "Efficient Packing",
            description: "Optimize image arrangement to save paper and reduce waste, ensuring every inch of the sheet is utilized effectively.",
        },
        {
            title: "Custom Layout Options",
            description: "Switch seamlessly between Freeform (manual) and Efficient (automatic) modes, giving you full control over your layout preferences.",
        },
        {
            title: "Save as PDF or Print",
            description: "Easily export your layouts as high-quality PDFs or print them directly from your device for instant results.",
        },
        {
            title: "Drag-and-Drop Simplicity",
            description: "Quickly upload images with a simple drag-and-drop or paste them directly using Ctrl+V for effortless workflow.",
        },
        {
            title: "Resizing & Cropping",
            description: "Adjust image sizes to fit your custom dimensions for personalized layouts.",
        },
        {
            title: "Completely Free",
            description: "Enjoy all features at no cost — no hidden fees, no subscriptions, just smarter and sustainable printing.",
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
