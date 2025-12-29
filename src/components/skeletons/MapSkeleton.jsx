const MapSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden animate-pulse">
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

export default MapSkeleton;
