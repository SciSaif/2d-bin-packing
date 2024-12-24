import React from "react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Method",
      description:
        "Select either Freeform Mode for manual customization or Efficient Mode for automatic arrangement of your images.",
      imgPath: "step1.gif",
    },
    {
      number: "02",
      title: "Upload Your Images",
      description: "Drag, drop, or upload images directly into the app to get started.",
      imgPath: "step2.gif",
    },
    {
      number: "03",
      title: "Arrange and Customize",
      description:
        "Optimize the layout by arranging your images and tweaking settings to match your preferences.",
      imgPath: "step3.gif",
    },
    {
      number: "04",
      title: "Efficient Packing Algorithm",
      description:
        "Our algorithm will arrange your images efficiently. Review the layout and make final adjustments as needed.",
      imgPath: "step4.gif",
    },
    {
      number: "05",
      title: "Save or Print",
      description: "Save your final work as a PDF and print it directly",
      imgPath: "step5.gif",
    },
  ];

  return (
    <section className="my-10 text-center">
      <h2 className="text-3xl font-bold text-secondary-900 mb-10">How It Works</h2>
      <div className="grid gap-12 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-teal-50 text-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center"
            style={{ height: "450px" }} // Increase container height
          >
            {/* Image (GIF) */}
            <div className="w-full h-48 mb-4">
              <img
                src={step.imgPath}
                alt={`Step ${step.number}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Number Box */}
            <div className="absolute -top-5 left-5 bg-teal-600 text-white font-extrabold text-xl w-14 h-14 flex items-center justify-center rounded-lg shadow-md">
              {step.number}
            </div>

            {/* Content */}
            <div className="text-center">
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
