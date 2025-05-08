'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'

export default function ProductManagement() {
  const [formData, setFormData] = useState({
    product_name: '',
    mrp: '',
    gst_rate: '',
    barcode_number: ''
  })
  const [excelFile, setExcelFile] = useState(null)
  const [toast, setToast] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setToast({
          title: "Success",
          description: "Product added successfully",
        })
        setFormData({
          product_name: '',
          mrp: '',
          gst_rate: '',
          barcode_number: ''
        })
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setExcelFile(file)
  }

  const processExcelFile = async () => {
    if (!excelFile) {
      setToast({
        title: "Error",
        description: "Please select an Excel file first.",
        variant: "error"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      for (const row of jsonData) {
        try {
          const token = localStorage.getItem('authToken')
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/addProduct`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              product_name: row.product_name,
              mrp: parseFloat(row.mrp),
              gst_rate: parseFloat(row.gst_rate),
              barcode_number: row.barcode_number.toString()
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to add product: ${row.product_name}`)
          }
        } catch (error) {
          console.error('Error adding product from Excel:', error)
        }
      }

      setToast({
        title: "Success",
        description: "Excel data processed and products added successfully",
      })
      setExcelFile(null)
    }
    reader.readAsArrayBuffer(excelFile)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Product Management</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Product Entry Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="mrp" className="block text-sm font-medium text-gray-700">MRP</label>
                <input
                  type="number"
                  id="mrp"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="gst_rate" className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
                <input
                  type="number"
                  id="gst_rate"
                  name="gst_rate"
                  value={formData.gst_rate}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="barcode_number" className="block text-sm font-medium text-gray-700">Barcode Number</label>
                <input
                  type="text"
                  id="barcode_number"
                  name="barcode_number"
                  value={formData.barcode_number}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="submit" className="w-full btn btn-info">
                Add Product
              </button>
            </form>
          </div>

          {/* Excel File Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Excel Sheet</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="excel_file" className="block text-sm font-medium text-gray-700">Choose Excel File</label>
                <input
                  type="file"
                  id="excel_file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={processExcelFile}
                className="w-full btn btn-soft btn-info"
              >
                Process Excel File
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm ${
          toast.variant === 'error' ? 'bg-red-100' : 'bg-green-100'
        }`}>
          <h3 className="font-bold text-lg">{toast.title}</h3>
          <p className="text-gray-600">{toast.description}</p>
        </div>
      )}
    </div>
  )
}

