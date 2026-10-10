import React from "react";

/**
 * EDIT THESE: replace with your real office details.
 * The map embed, directions link and "open in Google Maps" link
 * are all built from the address below.
 */
const office = {
  name: "Techverzing Technologies",
  addressLines: ["Your street address", "City, State PIN code", "India"],
  // Exact text Google Maps should search for (street, city, PIN).
  mapQuery: "Your street address, City, State PIN code, India",
};

const query = encodeURIComponent(office.mapQuery);
const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
const viewUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

const MapSection = () => {
  return (
    <section
      aria-labelledby="map-heading"
      className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="map-heading"
          className="text-2xl font-bold tracking-tight text-[#101c2d] sm:text-3xl"
        >
          Find us on the map
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Planning to visit? Message us first so we can confirm a time and make
          sure the right person is available.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Address card */}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff8b32]/12 text-[#ff8b32]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>

              <address className="not-italic">
                <p className="text-base font-semibold text-[#101c2d]">
                  {office.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {office.addressLines.map((line, i) => (
                    <React.Fragment key={line}>
                      {line}
                      {i < office.addressLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </address>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#ff8b32] px-4 py-2.5 text-sm font-bold text-[#101c2d] transition-colors duration-200 hover:bg-[#ff9b4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad70] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                Get directions
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-[#101c2d] transition-colors duration-200 hover:border-[#ff8b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8b32]"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            <iframe
              title={`Map showing the location of ${office.name}`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-72 w-full border-0 sm:h-96 lg:h-full lg:min-h-[22rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;