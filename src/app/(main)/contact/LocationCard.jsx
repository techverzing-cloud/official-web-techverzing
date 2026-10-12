import React from "react";
import { Icon } from "@iconify/react";

/**
 * A single office/location. Add more objects to the `locations` array in
 * mapSection.jsx to render additional offices — nothing else needs to change.
 */
const LocationCard = ({ label, name, addressLines, mapSrc, mapsQuery }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapsQuery
  )}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:items-center lg:gap-12">
      <div>
        <p className="font-spaceMono text-[11px] uppercase tracking-[0.18em] text-black-slate/60">
          {label}
        </p>
        <p className="mt-2 font-nunito text-lg font-semibold text-black-slate">
          {name}
        </p>
        <address className="mt-2 font-inter text-base not-italic leading-relaxed text-black-slate/70">
          {addressLines.map((line, i) => (
            <React.Fragment key={line}>
              {line}
              {i < addressLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </address>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="group mt-5 inline-flex items-center gap-2 rounded-full border border-black-slate/20 px-5 py-2.5 font-inter text-sm font-medium text-black-slate/80 transition-colors duration-200 hover:border-black-slate/40 hover:bg-black-slate/5 hover:text-black-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Get directions
          <Icon
            icon="lucide:arrow-up-right"
            width={16}
            height={16}
            aria-hidden="true"
            className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <figure className="overflow-hidden rounded-3xl border border-black-slate/10">
        <iframe
          title={`Map showing the location of ${name} — ${label}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-80 w-full border-0 sm:h-[28rem] lg:h-[32rem]"
        />
      </figure>
    </div>
  );
};

export default LocationCard;
