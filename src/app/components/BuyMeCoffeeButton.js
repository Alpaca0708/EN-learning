"use client";

import { useState } from "react";

export default function BuyMeCoffeeButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // <a
    //   href="https://www.buymeacoffee.com/enlearning"
    //   target="_blank"
    //   rel="noopener noreferrer"
    //   className="fixed bottom-16 right-6 z-50 flex items-center justify-center gap-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
    //   onMouseEnter={() => setIsHovered(true)}
    //   onMouseLeave={() => setIsHovered(false)}
    // >
    //   <span className="text-2xl">☕</span>
    //   <span
    //     className={`transition-all duration-300 ${isHovered ? "w-auto opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
    //   >
    //     Buy me a coffee
    //   </span>
    // </a>

    <a
      href="https://www.buymeacoffee.com/enlearning"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 right-6 z-50 w-20 h-20 bg-gradient-to-br from-[#FFDD00] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC107] rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 text-white"
      //   onMouseEnter={() => setIsHovered(true)}
      //   onMouseLeave={() => setIsHovered(false)}
    >
      {/* Coffee Logo */}
      <span className="text-4xl mb-0.5 leading-none">☕</span>

      {/* Small Text */}
      <div className="text-[10px] leading-tight text-center font-medium">
        <div>Buy me a cafe</div>
        {/* <div>a coffee</div> */}
      </div>
    </a>
  );
}
