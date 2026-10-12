import React from "react";
import SectionHeading from "@/components/home/SectionHeading";
import LocationCard from "./LocationCard";

/**
 * Add a new object here for each office. `LocationCard` handles the rest.
 */
const locations = [
  {
    id: "delhi-janakpuri",
    label: "Head Office",
    name: "Techverzing Technologies",
    addressLines: [
      "505, 5th Floor, DDA Building 5",
      "Janakpuri District Center",
      "Janakpuri, Delhi, 110058",
    ],
    mapsQuery:
      "505, 5th Floor, DDA Building 5, Janakpuri District Center, Janakpuri, Delhi, 110058",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.982303198658!2d77.07918877520258!3d28.630292484182874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d04bf07adce33%3A0xdd37d78784f6582e!2sDDA%20Building%2C%20Janakpuri%20District%20Center%2C%20Janakpuri%2C%20Delhi%2C%20110058!5e0!3m2!1sen!2sin!4v1791793693705!5m2!1sen!2sin",
  },
];

const MapSection = () => {
  return (
    <section
      data-light-bg
      aria-label="Office location"
      className="relative pb-[clamp(4rem,8vw,8rem)] pt-[clamp(1rem,3vw,3rem)]"
    >
      <div className="relative z-10 mrMx">
        <SectionHeading eyebrow="Visit us" heading="Or come by the office" />
        <p className="mt-5 max-w-[58ch] text-pretty font-inter text-base font-normal leading-[1.7] text-dull-text-dark md:text-lg">
          We work with teams everywhere, but you&rsquo;re always welcome to drop
          in. Message first and we&rsquo;ll make sure the right person is
          around.
        </p>

        <div className="mt-10">
          {locations.map((location) => (
            <LocationCard key={location.id} {...location} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
