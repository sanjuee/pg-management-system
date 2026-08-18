// app/dashboard/rent/loading.tsx

export default function LoadingRentPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* 1. HEADER SKELETON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 w-full md:w-auto">
          {/* Page Title */}
          <div className="h-8 w-44 bg-gray-200 rounded-lg animate-pulse"></div>
          {/* Page Subtitle */}
          <div className="h-4 w-72 bg-gray-200/60 rounded-md animate-pulse"></div>
        </div>
        
        {/* Search Input & Action Button controls */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="h-10 w-full md:w-64 bg-gray-200/80 rounded-full animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse hidden sm:block"></div>
        </div>
      </div>

      {/* 2. THREE SUMMARY CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div 
            key={card} 
            className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-3 animate-pulse"
          >
            {/* Card Label */}
            <div className="h-4 w-36 bg-gray-200/70 rounded-md"></div>
            {/* Massive Metric Display Number */}
            <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
            {/* Footnote Context */}
            <div className="h-3 w-20 bg-gray-200/50 rounded-md pt-1"></div>
          </div>
        ))}
      </div>

      {/* 3. INTERACTIVE LEDGER TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col animate-pulse">
        {/* Table Inner Subheader Action Row */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-24 bg-gray-200/80 rounded-lg"></div>
        </div>

        {/* Rows Container Display Grid Layout */}
        <div className="p-4 space-y-4">
          {/* Header Row Columns Labels Mockup */}
          <div className="grid grid-cols-6 gap-4 pb-2 border-b border-gray-50 px-2">
            <div className="h-3 bg-gray-200/70 rounded w-20"></div>
            <div className="h-3 bg-gray-200/70 rounded w-12"></div>
            <div className="h-3 bg-gray-200/70 rounded w-16"></div>
            <div className="h-3 bg-gray-200/70 rounded w-16"></div>
            <div className="h-3 bg-gray-200/70 rounded w-14"></div>
            <div className="h-3 bg-gray-200/70 rounded w-12 justify-self-end"></div>
          </div>

          {/* Dynamic Placeholder Rows Mapping Loops */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div 
              key={row} 
              className="grid grid-cols-6 gap-4 items-center py-3 border-b border-gray-50/50 last:border-0 px-2"
            >
              {/* Profile Avatar Initials Balloon + Name text string field */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              {/* Room Badge string value container block */}
              <div className="h-4 bg-gray-200/80 rounded w-10"></div>
              {/* Aggregated rental payment amount numerical representation tag */}
              <div className="h-4 bg-gray-200 rounded w-14"></div>
              {/* Current Billing Statement targeted validation due calendar deadline parameter */}
              <div className="h-4 bg-gray-200/80 rounded w-20"></div>
              {/* Categorization status ribbon context tracking bubble layout */}
              <div className="h-6 bg-gray-200/60 rounded-full w-16"></div>
              {/* Secondary operational call-to-action button element node */}
              <div className="h-8 bg-gray-200/80 rounded-lg w-20 justify-self-end"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}