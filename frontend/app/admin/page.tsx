import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Card */}
          <Link href="/admin/orders">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
              </div>
              <p className="text-gray-600">
                Create, view, and manage warehouse orders. Update order status, assign pickers, and set priorities.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                Manage Orders
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>

          {/* Shipments Card */}
          <Link href="/admin/shipments">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shipments</h2>
              </div>
              <p className="text-gray-600">
                Create, view, and manage inbound and outbound shipments. Track carriers, docks, and shipment status.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                Manage Shipments
                <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </div>

  
      </main>
    </div>
  );
}
