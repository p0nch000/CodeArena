export function FeaturedSkeleton() {
  return (
    <div className="w-full h-[300px] bg-mahindra-dark-blue rounded-xl animate-pulse opacity-70">
      <div className="h-full p-6 flex flex-col justify-between">
        <div>
          {/* Badge skeleton */}
          <div className="flex justify-between mb-3">
            <div className="w-24 h-6 bg-mahindra-black/60 rounded-full"></div>
            <div className="w-32 h-6 bg-mahindra-black/60 rounded-full"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="w-3/4 h-8 bg-mahindra-black/60 rounded mb-4"></div>
          
          {/* Description skeleton */}
          <div className="w-full h-24 bg-mahindra-black/60 rounded"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex justify-between">
          <div className="w-24 h-8 bg-mahindra-black/60 rounded"></div>
          <div className="w-32 h-8 bg-mahindra-black/60 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {[1, 2, 3].map((item) => (
        <div key={item} className="w-full h-[220px] bg-mahindra-dark-blue rounded-xl animate-pulse opacity-70">
          <div className="h-full p-6 flex flex-col justify-between">
            <div>
              {/* Badge skeleton */}
              <div className="flex justify-between mb-3">
                <div className="w-16 h-6 bg-mahindra-black/60 rounded-full"></div>
                <div className="w-24 h-6 bg-mahindra-black/60 rounded-full"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="w-3/4 h-7 bg-mahindra-black/60 rounded mb-3"></div>
              
              {/* Description skeleton */}
              <div className="w-full h-10 bg-mahindra-black/60 rounded"></div>
            </div>
            
            {/* Footer skeleton */}
            <div className="flex justify-between">
              <div className="w-16 h-6 bg-mahindra-black/60 rounded"></div>
              <div className="w-28 h-6 bg-mahindra-black/60 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopPerformersSkeleton() {
  return (
    <div className="w-full bg-mahindra-dark-blue border border-gray-800 rounded-xl overflow-hidden animate-pulse opacity-70">
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-mahindra-black/60 rounded-full"></div>
                <div className="w-32 h-6 bg-mahindra-black/60 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-mahindra-black/60 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 