import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Dropdownmenu = () => {
    // State for slider
    const [minPrice, setMinPrice] = useState(8950);
    const [maxPrice, setMaxPrice] = useState(18067);
    const [minPriceLayover, setMinPriceLayover] = useState(0);
    const [maxPriceLayover, setMaxPriceLayover] = useState(15);


    // State for accordions
    const [open, setOpen] = useState(null);

    // Tab state for Flight Schedules
    const [activeTab, setActiveTab] = useState("departure");

    const toggleAccordion = (index) => {
        setOpen(open === index ? null : index);
    };

    const accordionItems = [
        { title: "Stops", type: "text", content: "Non Stop" },
        { title: "Airlines", type: "airlines" },
        { title: "Flight Schedules", type: "schedules" },
        { title: "Baggage Policy", type: "text", content: "20kg" },
        { title: "Refundability", type: "text", content: "Partially Refundable" },
        { title: "Layover Time", type: "text", content: "" },
        { title: "Aircraft", type: "text", content: "" },
    ];

    const airlines = [
        { name: "US Bangla Airlines", price: 8950 },
        { name: "Air Astra", price: 8950 },
        { name: "Novo Air", price: 9835 },
        { name: "Biman Bangladesh", price: 11473 },
    ];

    return (
        <div className="w-full max-w-xs bg-white p-4 rounded-2xl shadow">
            {/* Price Range */}
            <div className="mb-4">
                <h3 className="font-medium text-gray-800 flex items-center justify-between">
                    Price Range
                </h3>

                {/* Slider */}
                <div className="relative w-full h-1.5 bg-white rounded-lg mt-4">
                    <div
                        className="absolute h-1.5 bg-red-500 rounded-lg"
                        style={{
                            left: `${((minPrice - 8950) / (18067 - 8950)) * 100}%`,
                            right: `${100 - ((maxPrice - 8950) / (18067 - 8950)) * 100}%`,
                        }}
                    ></div>

                    <input
                        type="range"
                        min="8950"
                        max="18067"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-auto"
                    />
                    <input
                        type="range"
                        min="8950"
                        max="18067"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-auto"
                    />
                </div>

                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>৳ {minPrice.toLocaleString()}</span>
                    <span>৳ {maxPrice.toLocaleString()}</span>
                </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2">
                {accordionItems.map((item, index) => (
                    <div key={index} className="bg-white overflow-hidden">
                        {/* Header */}
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="flex text-[14px] justify-between items-center w-full px-4 py-3 text-gray-700 font-medium"
                        >
                            {item.title}
                            <ChevronDown
                                size={20}
                                className={`transform transition-transform duration-300 ${open === index ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>

                        {/* Content */}
                        <div
                            className={`transition-all duration-500 overflow-hidden ${open === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="px-4 pb-3 text-sm text-gray-600">
                                {/* Custom Layover Time */}
                                {item.type === "text" && item.title === "Layover Time" && (
                                    <div className="relative mb-6"> {/* mb-6 increased for space below */}
                                        {/* Red background bar */}
                                        <div
                                            className="absolute h-1.5 bg-red-500 rounded-lg bottom-5"  // top-2 gives space from top
                                            style={{
                                                left: `${(minPriceLayover / 15) * 100}%`,
                                                right: `${100 - (maxPriceLayover / 15) * 100}%`,
                                            }}
                                        ></div>

                                        {/* Min thumb */}
                                        <input
                                            type="range"
                                            min={0}
                                            max={15}
                                            value={minPriceLayover}
                                            onChange={(e) =>
                                                setMinPriceLayover(Math.min(Number(e.target.value), maxPriceLayover - 1))
                                            }
                                            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto accent-red-500 bottom-4.5"
                                        />

                                        {/* Max thumb */}
                                        <input
                                            type="range"
                                            min={0}
                                            max={15}
                                            value={maxPriceLayover}
                                            onChange={(e) =>
                                                setMaxPriceLayover(Math.max(Number(e.target.value), minPriceLayover + 1))
                                            }
                                            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto accent-red-500 bottom-4.5"
                                        />

                                        {/* Labels */}
                                        <div className="flex justify-between text-xs text-gray-600 mt-6">
                                            <span>{minPriceLayover} hrs</span>
                                            <span>{maxPriceLayover}+ hrs</span>
                                        </div>
                                    </div>
                                )}




                                {/* Custom Aircraft */}
                                {item.type === "text" && item.title === "Aircraft" && (
                                    <div className="space-y-2">
                                        {["ATR 72", "ATR 72 - 600", "ATR725", "DH8"].map((model, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center gap-2 text-sm text-gray-700"
                                            >
                                                <input type="checkbox" className="w-4 h-4" />
                                                {model}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Default Text */}
                                {item.type === "text" &&
                                    item.title !== "Layover Time" &&
                                    item.title !== "Aircraft" && (
                                        <div className="flex gap-3">
                                            <input type="checkbox" className="w-4 h-4" />
                                            {item.content}
                                        </div>
                                    )}

                                {/* Airlines */}
                                {item.type === "airlines" && (
                                    <div className="space-y-2">
                                        {airlines.map((airline, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" className="w-4 h-4" />
                                                    <span className="text-[12px] font-semibold text-gray-500">
                                                        {airline.name}
                                                    </span>
                                                </div>
                                                <span className="text-gray-700 text-[12px]">
                                                    ৳ {airline.price.toLocaleString()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Flight Schedules */}
                                {item.type === "schedules" && (
                                    <div>
                                        <div className="flex border-b mb-3">
                                            <button
                                                onClick={() => setActiveTab("departure")}
                                                className={`px-4 py-2 text-sm font-medium text-center ${activeTab === "departure"
                                                    ? "text-red-500 border-b-2 border-red-500 bg-red-50"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                Departure
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("arrival")}
                                                className={`px-4 text-center py-2 text-sm font-medium ${activeTab === "arrival"
                                                    ? "text-red-500 border-b-2 border-red-500 bg-red-50"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                Arrival
                                            </button>
                                        </div>

                                        {activeTab === "departure" ? (
                                            <div>
                                                <p className="font-medium mb-2">
                                                    Departure Dhaka: Anytime
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    <div className="p-2 text-center">
                                                        🌅 Early Morning
                                                        <br />
                                                        00:00-05:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        🌙 Morning
                                                        <br />
                                                        06:00-11:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        ☀️ Afternoon
                                                        <br />
                                                        12:00-17:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        🌆 Evening
                                                        <br />
                                                        18:00-23:59
                                                    </div>
                                                </div>

                                                <p className="font-medium mb-2">
                                                    Departure Cox's Bazar: Anytime
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-2 text-center">
                                                        🌅 Early Morning
                                                        <br />
                                                        00:00-05:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        🌙 Morning
                                                        <br />
                                                        06:00-11:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        ☀️ Afternoon
                                                        <br />
                                                        12:00-17:59
                                                    </div>
                                                    <div className="p-2 text-center">
                                                        🌆 Evening
                                                        <br />
                                                        18:00-23:59
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium mb-2">Arrival Dhaka: Anytime</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="border rounded-lg p-2 text-center">
                                                        🌅 Early Morning
                                                        <br />
                                                        00:00-05:59
                                                    </div>
                                                    <div className="border rounded-lg p-2 text-center">
                                                        🌙 Morning
                                                        <br />
                                                        06:00-11:59
                                                    </div>
                                                    <div className="border rounded-lg p-2 text-center">
                                                        ☀️ Afternoon
                                                        <br />
                                                        12:00-17:59
                                                    </div>
                                                    <div className="border rounded-lg p-2 text-center">
                                                        🌆 Evening
                                                        <br />
                                                        18:00-23:59
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropdownmenu;
