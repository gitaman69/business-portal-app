'use client'

import { useState } from 'react'

export default function NewProductForm({ barcode, onClose, onProductAdded }) {
  const [productName, setProductName] = useState('')
  const [mrp, setMrp] = useState('')
  const [gstRate, setGstRate] = useState('')
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://business-portal-app.onrender.com/api/auth/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: productName,
          mrp: parseFloat(mrp),
          gst_rate: parseFloat(gstRate),
          barcode_number: barcode,
        }),
      })

      if (response.ok) {
        const newProduct = await response.json()
        setToast({
          title: "Success",
          description: "Product added successfully",
        })
        onProductAdded(newProduct.product)
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      setToast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "error"
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
            <input id="barcode" value={barcode} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">MRP</label>
            <input
              id="mrp"
              type="number"
              step="0.01"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
            <input
              id="gstRate"
              type="number"
              step="0.01"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Add Product
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm">
          <h3 className="font-bold text-lg">{toast.title}</h3>
          <p className="text-gray-600">{toast.description}</p>
        </div>
      )}
    </div>
  )
}

