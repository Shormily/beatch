import heroImage from "../LandingPages/assets/Des2.png";

const AboutUS = () => {
    return (
        <>
            <div className="w-full  bg-white text-gray-800 font-murecho ">
                {/* Hero */}
                <section className="relative h-[25vh] md:h-[25vh] lg:h-[25vh] min-h-[320px] flex items-center justify-center overflow-hidden">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{ backgroundImage: `url(${heroImage})` }}
                        aria-hidden
                    />
                    {/* Color overlay to match the warm red/orange tone */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#b51c2b]/70 via-[#b51c2b]/55 to-[#b51c2b]/40 mix-blend-multiply" aria-hidden />
                    {/* Subtle dark vignette for text contrast */}
                    <div className="absolute inset-0 bg-black/20" aria-hidden />


                    <h1 className="relative z-10 text-white font-bold tracking-tight text-5xl  drop-shadow-md">
                        About Us yup
                    </h1>
                </section>


                {/* Body copy */}
                <section className="px-4 sm:px-6 bg-gray-100 lg:px-8 py-6">
                    <div className="mx-auto max-w-6xl leading-relaxed text-[15px] sm:text-base text-gray-700 space-y-6 text-justify">
                        <p>
                            Firststrip Limited, an initiative by US–Bangla Airlines, is a leading
                            Online Travel Agency (OTA) in Bangladesh. Our tagline, "Seamless
                            Travelling," highlights our aim to make travel arrangements easy and
                            hassle‑free. We combine travel and technology to simplify the booking
                            process and continually update our services to match travellers'
                            changing needs. Backed by our parent company, US–Bangla Group, known
                            for its rapid growth since 2009, we offer efficient, technology‑based
                            travel solutions.
                        </p>


                        <p>
                            At Firststrip, we pride ourselves on providing exclusive pricing and
                            unbeatable deals on flights, thrilling tours, holiday packages, visa
                            processing, and hotel bookings. Our commitment to inclusivity is
                            reflected in our comprehensive integration with major airlines,
                            banks, and mobile financial service providers. We also offer
                            specialized Meet &amp; Greet services and comprehensive Umrah packages,
                            ensuring a seamless and fulfilling travel experience. By prioritizing
                            technological innovation and customer satisfaction, Firststrip is
                            dedicated to creating memorable travel experiences for all.
                        </p>
                    </div>
                </section>
            </div>

        </>
    );
};

export default AboutUS;