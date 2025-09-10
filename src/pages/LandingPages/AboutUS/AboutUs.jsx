import React from 'react';
import AboutUS from '../../../components/LandingPages/AboutUS';
import Aboutpart1 from '../../../components/LandingPages/Aboutpart1';
import Explore from '../../../components/LandingPages/Explore';
import Aboutuspart2 from '../../../components/LandingPages/Aboutuspart2';
import ContactUs from '../../../components/LandingPages/ContactUs';

const AboutUs = () => {
    return (
        <>
            <AboutUS /> 
            {/* <Aboutpart1 /> */}
            <Aboutuspart2 />
            <ContactUs/>
            <Explore/>
        </>
    );
};

export default AboutUs;