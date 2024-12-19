import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NewProductForm from "./newProduct";

export default function BillingPage() {
  const [barcode, setBarcode] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:5000/api/auth/product/${barcode}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (response.ok) {
        const product = await response.json();
        setBillItems([...billItems, { ...product, quantity: 1 }]);
        setBarcode("");
      } else {
        setToast({
          title: "Product not found",
          description: "Would you like to add this product?",
          action: () => setShowNewProductForm(true),
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setToast({
        title: "Error",
        description: "Failed to fetch product. Please try again.",
        variant: "error",
      });
    }
  };

  const calculateTotal = () => {
    return billItems.reduce(
      (total, item) => total + item.mrp * item.quantity,
      0
    );
  };

  const handleDeleteItem = (index) => {
    const updatedItems = billItems.filter((_, i) => i !== index);
    setBillItems(updatedItems);
  };

  const calculateGST = (price, gstRate) => {
    return (price * gstRate) / (100 + gstRate); // GST portion included in the price
  };

  const printBill = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add logo (replace with your actual logo)
    //const logoWidth = 40;
    //const logoHeight = 40;
    //doc.addImage('', 'PNG', 10, 10, logoWidth, logoHeight);

    // Add store name and details
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text("Your Store Name", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94); // Slightly lighter blue
    doc.text("123 Store Street, City, Country", pageWidth / 2, 30, {
      align: "center",
    });
    doc.text(
      "Phone: +1 234 567 890 | Email: store@example.com",
      pageWidth / 2,
      35,
      { align: "center" }
    );

    // Add invoice title
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185); // Light blue color
    doc.text("Invoice", pageWidth / 2, 50, { align: "center" });

    // Add invoice details
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    const invoiceDate = new Date().toLocaleDateString();
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    doc.text(`Date: ${invoiceDate}`, 10, 60);
    doc.text(`Invoice Number: ${invoiceNumber}`, pageWidth - 10, 60, {
      align: "right",
    });

    // Prepare table data
    const tableData = billItems.map((item) => {
      const gstAmount = calculateGST(item.mrp, item.gst_rate);
      const priceExcludingGST = item.mrp - gstAmount;
      return [
        item.product_name,
        `₹${priceExcludingGST.toFixed(2)}`,
        `₹${gstAmount.toFixed(2)}`,
        item.quantity,
        `₹${(item.mrp * item.quantity).toFixed(2)}`,
      ];
    });

    // Add table to the PDF
    doc.autoTable({
      head: [["Product", "Price", "GST", "Quantity", "Total"]],
      body: tableData,
      startY: 70,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [242, 242, 242] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 30, halign: "right" },
        2: { cellWidth: 30, halign: "right" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
      },
    });

    // Add the total
    const total = calculateTotal();
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Subtotal:`, pageWidth - 60, finalY + 10);
    doc.text(`₹${total.toFixed(2)}`, pageWidth - 10, finalY + 10, {
      align: "right",
    });
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`Total:`, pageWidth - 60, finalY + 30);
    doc.text(`₹${total.toFixed(2)}`, pageWidth - 10, finalY + 30, {
      align: "right",
    });

    // Add footer
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(149, 165, 166);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 20, {
      align: "center",
    });

    // Save the PDF
    doc.save("invoice.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Billing System
        </h1>

        <form onSubmit={handleBarcodeSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Scan or enter barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Item
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">GST</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.product_name}</td>
                  <td className="px-4 py-2">₹{item.mrp.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.gst_rate}%</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...billItems];
                        updatedItems[index].quantity =
                          parseInt(e.target.value) || 1;
                        setBillItems(updatedItems);
                      }}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    ₹{(item.mrp * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            Total: ₹{calculateTotal().toFixed(2)}
          </div>
          <button
            onClick={printBill}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Print Bill
          </button>
        </div>
      </div>

      {showNewProductForm && (
        <NewProductForm
          barcode={barcode}
          onClose={() => setShowNewProductForm(false)}
          onProductAdded={(newProduct) => {
            setBillItems([...billItems, { ...newProduct, quantity: 1 }]);
            setShowNewProductForm(false);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm">
          <h3 className="font-bold text-lg">{toast.title}</h3>
          <p className="text-gray-600">{toast.description}</p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action();
                setToast(null);
              }}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          )}
        </div>
      )}
    </div>
  );
}
