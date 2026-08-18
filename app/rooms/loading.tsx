// app/dashboard/rooms/loading.tsx

export default function LoadingRooms() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-3 w-full sm:w-auto">
          {/* Title Placeholder */}
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
          {/* Subtitle Placeholder */}
          <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse"></div>
        </div>
        
        {/* Buttons Placeholder */}
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="h-10 w-full sm:w-40 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-10 w-full sm:w-40 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 2. FILTER BAR SKELETON */}
      <div className="h-[72px] w-full bg-slate-50/80 rounded-xl border border-slate-100 animate-pulse flex items-center px-4">
        <div className="h-8 w-64 bg-slate-200/60 rounded-lg"></div>
      </div>

      {/* 3. GRID CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate 6 skeleton cards to fill the screen beautifully */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-100 rounded-2xl p-6 h-[220px] flex flex-col justify-between shadow-sm animate-pulse"
          >
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-3">
                  <div className="h-7 w-16 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
                </div>
                {/* Status Badge */}
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
              </div>

              {/* Card Mid-Section */}
              <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded-md"></div>
                  <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100"></div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-200"></div>
              <div className="h-3 w-32 bg-slate-100 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}