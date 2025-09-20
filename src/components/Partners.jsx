import React, { useState } from "react";

const Partners = () => {
  const [isHovered, setIsHovered] = useState(false);

  const partnerLogos1 = [
    "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
    "https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/11/Spotify-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/06/Adobe-Logo-700x394.png",
  ];

  const partnerLogos2 = [
    "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/09/Shopify-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/09/Zoom-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/09/Dropbox-Logo-700x394.png",
    "https://logos-world.net/wp-content/uploads/2020/11/Mastercard-Logo-700x394.png",
  ];

  const duplicatedLogos1 = [...partnerLogos1, ...partnerLogos1];
  const duplicatedLogos2 = [...partnerLogos2, ...partnerLogos2];

  return (
    <section className="py-16 overflow-hidden w-full">
      <div className="w-full mx-auto px-4">
        {/* First Row - Left Scroll */}
        <div
          className="overflow-hidden w-full mb-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex items-center py-6 animate-marquee ${
              isHovered ? "pause" : ""
            }`}
          >
            {duplicatedLogos1.map((logo, index) => (
              <div
                key={`row1-${index}`}
                className="mx-8 transition-transform duration-300 hover:scale-110 flex-shrink-0 w-[140px]"
              >
                <img
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  className="w-full h-auto max-h-[80px] object-contain opacity-70 hover:opacity-100 transition duration-300 filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Right Scroll */}
        <div
          className="overflow-hidden w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex items-center py-6 animate-marquee-right ${
              isHovered ? "pause" : ""
            }`}
          >
            {duplicatedLogos2.map((logo, index) => (
              <div
                key={`row2-${index}`}
                className="mx-8 transition-transform duration-300 hover:scale-110 flex-shrink-0 w-[140px]"
              >
                <img
                  src={logo}
                  alt={`Partner ${index + 13}`}
                  className="w-full h-auto max-h-[80px] object-contain opacity-70 hover:opacity-100 transition duration-300 filter grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
