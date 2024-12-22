'use client'

import { useState } from 'react'

export default function InventoryView() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/allProducts`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Inventory Overview</h1>
        
        <div className="mb-8 text-center">
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isLoading ? 'Loading...' : 'View Inventory'}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-8">
            Error: {error}
          </div>
        )}

        {products.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      MRP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      GST Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Barcode
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {products.map((product, index) => (
                    <tr key={product.id || index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">₹{product.mrp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.gst_rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{product.barcode_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 mt-8">
            No products to display. Click the button above to load inventory data.
          </div>
        )}
      </div>
    </div>
  )
}

