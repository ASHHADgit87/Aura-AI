import React from "react";

const FooterForFeature = () => {
  const currentYear = new Date().getFullYear();
  const yearText = currentYear === 2026 ? "2026" : `2026-${currentYear}`;

  return (
    <div className="bg-[#E10600] text-center py-6 text-white text-md font-semibold border-t mt-auto">
      <p>
        Copyright © {yearText} Aura-AI - Muhammad Ashhadullah Zaheer. All rights
        reserved
      </p>
    </div>
  );
};

export default FooterForFeature;
