import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Dropdownmenu = () => {
  // State for slider
  const [minPrice, setMinPrice] = useState(8950);
  const [maxPrice, setMaxPrice] = useState(18067);

  // State for accordions
  const [open, setOpen] = useState(null);

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  const accordionItems = [
    { title: "Stops", content: "Choose direct or with layovers." },
    { title: "Airlines", content: "List of available airlines here." },
    { title: "Flight Schedules", content: "Flight time ranges & options." },
    { title: "Baggage Policy", content: "Hand luggage + checked baggage." },
    { title: "Refundability", content: "Refundable & non-refundable options." },
    { title: "Layover Time", content: "Min & max layover duration." },
    { title: "Aircraft", content: "Aircraft model details here." },
  ];

  return (
    <div className="w-full max-w-xs bg-white p-4 rounded-2xl shadow">
      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-800 flex items-center justify-between">
          Price Range
        </h3>

        {/* Slider */}
        <div className="relative w-full h-2 bg-gray-200 rounded-lg mt-4">
          {/* Track between thumbs */}
          <div
            className="absolute h-2 bg-red-500 rounded-lg"
            style={{
              left: `${((minPrice - 8950) / (18067 - 8950)) * 100}%`,
              right: `${100 - ((maxPrice - 8950) / (18067 - 8950)) * 100}%`,
            }}
          ></div>

          {/* Min thumb */}
          <input
            type="range"
            min="8950"
            max="18067"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
          />

          {/* Max thumb */}
          <input
            type="range"
            min="8950"
            max="18067"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
          />
        </div>

        {/* Price Values */}
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>৳ {minPrice.toLocaleString()}</span>
          <span>৳ {maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-2">
        {accordionItems.map((item, index) => (
          <div
            key={index}
            className="bg-white  overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggleAccordion(index)}
              className="flex justify-between items-center w-full px-4 py-3 text-gray-700 font-medium"
            >
              {item.title}
              <ChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  open === index ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Smooth content */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                open === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-3 text-sm text-gray-600">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdownmenu;
