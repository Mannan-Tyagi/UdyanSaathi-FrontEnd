const WardCardSkeleton = () => (
  <div className="bg-surface backdrop-blur border border-mist rounded-card overflow-hidden animate-pulse shadow-card">
    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-metal/30"></div>
    
    <div className="p-4 pl-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 bg-mist rounded w-32"></div>
            <div className="h-5 bg-mist rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-mist rounded w-24"></div>
        </div>
        
        <div className="text-right">
          <div className="h-10 w-16 bg-mist rounded mb-1"></div>
          <div className="h-4 bg-mist rounded w-20"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-canvas rounded-card p-2">
            <div className="h-3 bg-mist rounded w-8 mb-1 mx-auto"></div>
            <div className="h-4 bg-mist rounded w-10 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WardCardSkeleton;
