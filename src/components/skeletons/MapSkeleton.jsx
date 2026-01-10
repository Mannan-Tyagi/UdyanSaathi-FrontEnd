const MapSkeleton = () => (
  <div className="w-full h-full bg-surface rounded-card overflow-hidden animate-pulse border border-mist">
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <div className="h-4 bg-mist rounded-card w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

export default MapSkeleton;
