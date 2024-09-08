export const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden border-[1px] border-gray-300 p-2 w-full ">
    {children}
  </div>
);

// components/ui/card/CardContent.js
export const CardContent = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);