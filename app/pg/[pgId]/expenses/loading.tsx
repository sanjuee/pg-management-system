export default function LoadingExpensesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      
      {/* 1. HEADER SKELETON */}
      <div className="mb-8 space-y-3">
        <div className="h-4 w-32 bg-gray-200/60 rounded-md animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-4 w-72 bg-gray-200/60 rounded-md animate-pulse"></div>
      </div>

      {/* 2. EXPENSE LOGGER FORM SKELETON */}
      <div className="mb-8 bg-white rounded-2xl border border-gray-200 shadow-sm h-72 animate-pulse">
        <div className="flex flex-col md:flex-row h-full">
          <div className="p-6 md:w-1/3 border-r border-gray-100 space-y-4">
            <div className="h-5 w-32 bg-gray-200/70 rounded-md mb-6"></div>
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg mt-2"></div>
          </div>
          <div className="p-6 md:w-2/3 space-y-4">
            <div className="h-5 w-40 bg-gray-200/70 rounded-md mb-4"></div>
            <div className="w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100"></div>
          </div>
        </div>
      </div>

      {/* 3. TABLE SKELETON */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
        <div className="p-4 grid grid-cols-4 gap-4 bg-gray-50 border-b border-gray-100 px-6">
          <div className="h-4 bg-gray-200/70 rounded w-20"></div>
          <div className="h-4 bg-gray-200/70 rounded w-24 justify-self-end"></div>
          <div className="h-4 bg-gray-200/70 rounded w-24 justify-self-end"></div>
          <div className="h-4 bg-gray-200/70 rounded w-28 justify-self-end"></div>
        </div>
        
        <div className="p-6 space-y-6">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-4 gap-4 items-center">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-5 bg-gray-200 rounded w-24 justify-self-end"></div>
              <div className="h-5 bg-gray-200 rounded w-24 justify-self-end"></div>
              <div className="h-8 bg-gray-200/80 rounded-lg w-32 justify-self-end"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
