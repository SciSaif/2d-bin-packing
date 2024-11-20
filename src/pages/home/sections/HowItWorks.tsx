import React from "react";

const HowItWorks: React.FC = () => {
    const steps = [
        {
            title: "Upload Your Images",
            description: "Drag, drop, or paste your images directly into the app.",
        },
        {
            title: "Optimize the Layout",
            description: "Choose Efficient Mode for automatic arrangement or Freeform Mode for manual customization.",
        },
        {
            title: "Preview and Save",
            description: "View the optimized layout, make adjustments, and save as a PDF or print directly.",
        },
    ];

    return (
        <section className="my-10 text-center">
            <h2 className="text-2xl font-bold text-secondary-900">How It Works</h2>
            <div className="grid gap-6 mt-6 sm:grid-cols-3">
                {steps.map((step, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                        <p className="text-sm text-gray-700">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
