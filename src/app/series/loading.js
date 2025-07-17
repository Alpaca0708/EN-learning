// export default function Loading() {
//   return (
//     <div className="bg-[#171212] min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         {/* 简单的旋转动画 */}
//         <div className="w-12 h-12 border-4 border-[#382929] border-t-white rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-white text-lg">Loading...</p>
//       </div>
//     </div>
//   );
// }

export default function Loading() {
  return (
    <div className="bg-[#171212] min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* EN Learning 风格的加载动画 */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          <div
            className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>
        <p className="text-white text-lg font-medium">Loading content...</p>
      </div>
    </div>
  );
}
