// app/tenants/loading.tsx

export default function LoadingTenantsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-2 w-full md:w-auto">
          {/* Page Title */}
          <div className="h-9 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          {/* Page Subtitle */}
          <div className="h-5 w-96 bg-gray-200/60 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* 2. INTERACTIVE TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col animate-pulse">
        {/* Table Controls Skeleton (Search, Filter, Export) */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="h-10 w-full sm:w-64 bg-gray-200 rounded-xl"></div>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="h-10 w-full sm:w-40 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-full sm:w-28 bg-gray-200 rounded-xl hidden sm:block"></div>
          </div>
        </div>

        {/* Rows Container Display Grid Layout */}
        <div className="p-4 space-y-4">
          {/* Header Row Columns Labels Mockup */}
          <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-50 px-2">
            <div className="h-3 bg-gray-200/70 rounded w-24"></div>
            <div className="h-3 bg-gray-200/70 rounded w-16"></div>
            <div className="h-3 bg-gray-200/70 rounded w-20"></div>
            <div className="h-3 bg-gray-200/70 rounded w-24"></div>
            <div className="h-3 bg-gray-200/70 rounded w-16 justify-self-end pr-4"></div>
          </div>

          {/* Dynamic Placeholder Rows Mapping Loops */}
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div 
              key={row} 
              className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-50/50 last:border-0 px-2"
            >
              {/* Profile Avatar + Name/Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-3 bg-gray-200/60 rounded w-20"></div>
                </div>
              </div>
              {/* Room badge/text */}
              <div className="h-5 bg-gray-200/80 rounded w-14"></div>
              {/* Base Rent */}
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              {/* Joined Date */}
              <div className="h-4 bg-gray-200/80 rounded w-24"></div>
              {/* Actions button */}
              <div className="h-8 bg-gray-200/80 rounded-lg w-20 justify-self-end"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
