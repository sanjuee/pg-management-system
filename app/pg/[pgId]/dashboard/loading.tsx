export default function LoadingDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 1. HEADER SKELETON */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-44 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-4 w-72 bg-gray-200/60 rounded-md animate-pulse"></div>
      </div>

      {/* 2. THREE SUMMARY CARDS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-3 animate-pulse h-32"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-36 bg-gray-200/70 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-200/70 rounded-lg"></div>
            </div>
            <div className="h-8 w-28 bg-gray-200 rounded-lg mt-4"></div>
            <div className="h-3 w-40 bg-gray-200/50 rounded-md pt-1"></div>
          </div>
        ))}
      </div>

      {/* 3. MIDDLE ROW SKELETON (Charts / Feeds) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-64 animate-pulse p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-gray-200/70 rounded-lg"></div>
            <div className="h-4 w-32 bg-gray-200/70 rounded-md"></div>
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200/60 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-64 animate-pulse p-6">
          <div className="h-4 w-32 bg-gray-200/70 rounded-md mb-6"></div>
          <div className="flex justify-center items-center h-full pb-8">
            <div className="w-32 h-32 rounded-full border-[16px] border-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
