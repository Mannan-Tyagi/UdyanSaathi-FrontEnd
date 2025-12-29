const WardCardSkeleton = () => (
  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden animate-pulse">
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-600"></div>
    
    <div className="p-4 pl-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 bg-white/10 rounded w-32"></div>
            <div className="h-5 bg-white/10 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-white/10 rounded w-24"></div>
        </div>
        
        <div className="text-right">
          <div className="h-10 w-16 bg-white/10 rounded mb-1"></div>
          <div className="h-4 bg-white/10 rounded w-20"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-black/20 rounded-lg p-2">
            <div className="h-3 bg-white/10 rounded w-8 mb-1 mx-auto"></div>
            <div className="h-4 bg-white/10 rounded w-10 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WardCardSkeleton;
