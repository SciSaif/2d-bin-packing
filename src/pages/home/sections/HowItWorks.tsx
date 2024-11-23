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
      description:
        "Save your final work as a PDF and print it directly",
      imgPath: "step5.gif", 
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
            {/* Image (GIF) */}
            <div className="mb-4">
              <img
                src={step.imgPath}
                alt={`Step ${step.number}`}
                className="w-full h-auto rounded-lg"
              />
            </div>

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
