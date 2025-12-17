import { Camera, Tag, Wallet } from "lucide-react";
import React from "react";

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description:
      "Post an ad on BookKart describing your book details to sell your old books online.",
    icon: <Camera className="h-8 w-8 text-red-600" />,
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description: "Set the price for your books at which you want to sell them.",
    icon: <Tag className="h-8 w-8 text-red-600" />,
  },
  {
    step: "Step 3",
    title: "Get paid into your UPI/Bank account",
    description:
      "You will get money into your account once you receive an order for your book.",
    icon: <Wallet className="h-8 w-8 text-red-600" />,
  },
];

const HowToSell = () => {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            How to Register your Brand to Sell on{" "}
            <span className="text-red-600">MYSMME</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Save time and earn money by selling your brand’s products online in
            just three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-10">
          {/* Dashed line connecting steps (only on desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-gray-300 -z-10"></div>

          {sellSteps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 shadow-lg text-center flex flex-col items-center"
            >
              {/* Step Label */}
              <div className="absolute -top-3 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
                {step.icon}
              </div>

              {/* Text */}
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToSell;
