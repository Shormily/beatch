import Air from "../../../assets/Air.png";
import Air2 from "../../../assets/Air2.png";
import Air3 from "../../../assets/Air3.png";
import Air5 from "../../../assets/Air5.png";
import Air7 from "../../../assets/Air7.png";
import Air8 from "../../../assets/Air8.png";
import Air9 from "../../../assets/Air9.png";
import Air10 from "../../../assets/Air10.png";
import Air11 from "../../../assets/Air11.webp";
import Air12 from "../../../assets/Air12.webp";
import Air13 from "../../../assets/Air13.png";
import Air14 from "../../../assets/Air14.png";

// Fake data
const airlines = [
  { name: "US Bangla Airlines", logo: Air7 },
  { name: "Air Astra", logo: Air10 },
  { name: "Novo Air", logo: Air13 },
  { name: "Biman Bangladesh Airlines", logo: Air },
  { name: "Emirates", logo: Air14 },
  { name: "Singapore Airlines", logo: Air3 },
  { name: "Malaysia Airlines", logo: Air8 },
  { name: "Turkish Airlines", logo: Air5 },
  { name: "Air India", logo: Air9 },
  { name: "Cathay Pacific", logo: Air11 },
  { name: "Cathay Pacific", logo: Air2 },
  { name: "IndiGo", logo: Air12 },
];

const AirlineAlliances = () => {
  return (
    <div className="bg-white py-12 font-murecho">
      <div className="max-w-[1240px] mx-auto text-center px-8">
        <h2 className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Travel Beyond Expectations with Our Trusted Airline Alliances
        </h2>
        <p className="text-gray-600 mt-2">
          With Firsttrip, your journey begins with the best names in the sky
        </p>

        {/* Airline logos grid */}
       <div className="mt-10 grid m-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
  {airlines.map((airline, index) => (
    <div
      key={index}
      className="flex flex-row items-center gap-4 bg-white p-4 rounded-xl hover:shadow-lg transition-shadow duration-300 w-full max-w-[250px] mx-auto"
    >
      <img
        src={airline.logo}
        alt={airline.name}
        className="h-12 object-contain"
      />
      <p className="text-[17px] font-medium text-gray-800 text-left">
        {airline.name}
      </p>
    </div>
  ))}
</div>


      </div>
    </div>


  );
};

export default AirlineAlliances;
