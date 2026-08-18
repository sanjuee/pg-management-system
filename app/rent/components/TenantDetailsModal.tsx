"use client"

export default function TenantDetailsModal({ tenant, onClose }: { tenant: any, onClose: () => void }) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black">
              {tenant.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{tenant.name}</h2>
              <p className="text-gray-500">Room {tenant.room}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone Number</p>
              <p className="font-medium text-gray-900">{tenant.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Rent Amount</p>
              <p className="font-bold text-gray-900">₹{tenant.amount}/mo</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Current Payment Status</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{tenant.dueDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                tenant.status === 'Paid' ? 'bg-green-100 text-green-700' :
                tenant.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tenant.status}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
            onClick={() => window.open(`https://wa.me/91${tenant.phone}`, '_blank')}
          >
            WhatsApp
          </button>
          
          {tenant.status !== 'Paid' && (
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm">
              Mark as Paid
            </button>
          )}
        </div>

      </div>
    </div>
  )
}