import React from "react";

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: "Efficient Packing",
            description: "Automatically arrange images to save paper and reduce waste.",
        },
        {
            title: "Custom Layout Options",
            description: "Switch between automatic and manual modes for flexibility.",
        },
        {
            title: "Save as PDF or Print",
            description: "Export your layouts or print directly from your desktop.",
        },
        {
            title: "Drag-and-Drop Simplicity",
            description: "Upload images quickly or paste directly with Ctrl+V.",
        },
        {
            title: "Resizing & Cropping",
            description: "Resize images to fit paper or standard photo sizes like passport or visa.",
        },
        {
            title: "Completely Free",
            description: "No hidden costs, no subscriptions — just smarter printing.",
        },
    ];

    return (
        <section className="my-10 text-center">
            <h2 className="text-2xl font-bold text-secondary-900">Features</h2>
            <div className="grid gap-6 mt-6 sm:grid-cols-3">
                {features.map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                        <p className="text-sm text-gray-700">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
