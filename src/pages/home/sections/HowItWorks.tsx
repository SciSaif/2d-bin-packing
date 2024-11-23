import React from "react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Method",
      description:
        "Select either Freeform Mode for manual customization or Efficient Mode for automatic arrangement of your images.",
    },
    {
      number: "02",
      title: "Upload Your Images",
      description: "Drag, drop, or upload images directly into the app to get started.",
    },
    {
      number: "03",
      title: "Arrange and Customize",
      description:
        "Optimize the layout by arranging your images and tweaking settings to match your preferences.",
    },
    {
      number: "04",
      title: "Preview the Layout",
      description:
        "Review your arranged layout and make final adjustments to ensure it meets your needs.",
    },
    {
      number: "05",
      title: "Save or Share",
      description:
        "Save your final work as a PDF, print it directly, or share it with others.",
    },
  ];

  return (
    <section className="my-10 text-center">
      <h2 className="text-2xl font-bold text-secondary-900">How It Works</h2>
      <div className="grid gap-8 mt-6 sm:grid-cols-3 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-teal-50 text-gray-800 p-6 rounded-xl shadow-lg mt-6"
          >
            {/* Number Box */}
            <div className="absolute -top-6 left-6 bg-teal-600 text-white font-extrabold text-xl w-12 h-12 flex items-center justify-center rounded-lg shadow-md">
              {step.number}
            </div>
            {/* Content */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
