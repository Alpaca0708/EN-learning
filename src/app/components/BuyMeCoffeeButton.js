export default function BuyMeCoffeeButton() {
  return (
    <a
      href="https://www.buymeacoffee.com/enlearning"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 right-6 z-50 w-20 h-20 bg-gradient-to-br from-[#FFDD00] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC107] rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 text-white"
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
