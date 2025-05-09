import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NewProductForm from "./newProduct.jsx";

export default function BillingPage() {
  const [barcode, setBarcode] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [billData, setBillData] = useState({});

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/get-bill-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBillData(response.data[0]);
      } catch (error) {
        console.error("Error fetching bill data:", error);
        alert("Failed to fetch bill data");
      }
    };

    fetchBillData();
  }, []);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/product/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const printBill = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const primaryColor = [88, 101, 242];
    const secondaryColor = [245, 245, 255];
    const textColor = [33, 33, 33];

    // === Top Header ===
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(billData.storeName, pageWidth / 2, 12, { align: "center" });

    // === Store Info ===
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(`${billData.storeAddress}`, pageWidth / 2, 26, {
      align: "center",
    });
    doc.text(
      `Phone: ${billData.storeContact} | Email: ${billData.storeMail}`,
      pageWidth / 2,
      32,
      { align: "center" }
    );

    // === Invoice Info ===
    const invoiceDate = new Date();
    const invoiceNumber = `INV-${Math.floor(Math.random() * 10000)}`;
    doc.text(`No: ${invoiceNumber}`, pageWidth - 10, 26, { align: "right" });
    doc.text(`Date: ${invoiceDate.toLocaleDateString()}`, pageWidth - 10, 32, {
      align: "right",
    });
    doc.text(
      `Time: ${invoiceDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      pageWidth - 10,
      38,
      { align: "right" }
    );

    // === Table Data ===
    const tableData = billItems.map((item) => {
      const gstAmount = calculateGST(item.mrp, item.gst_rate);
      const priceExclGST = item.mrp - gstAmount;
      return [
        item.product_name,
        `${priceExclGST.toFixed(2)}`,
        `${gstAmount.toFixed(2)}`,
        item.quantity,
        `${(item.mrp * item.quantity).toFixed(2)}`,
      ];
    });

    doc.autoTable({
      head: [["Product", "Price", "GST", "Qty", "Total"]],
      body: tableData,
      startY: 46,
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: textColor,
        lineColor: [222, 222, 222],
        lineWidth: 0.1,
      },
      alternateRowStyles: { fillColor: secondaryColor },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    const total = calculateTotal();
    const finalY = doc.lastAutoTable.finalY || 100;
    const gstTotal = billItems.reduce((sum, item) => {
      return sum + calculateGST(item.mrp, item.gst_rate) * item.quantity;
    }, 0);

    // === Totals on right ===
    const totalsY = finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text("Gross Amount", pageWidth - 60, totalsY);
    doc.text(`${total.toFixed(2)}`, pageWidth - 10, totalsY, {
      align: "right",
    });

    doc.text("Discount", pageWidth - 60, totalsY + 6);
    doc.text(`0.00`, pageWidth - 10, totalsY + 6, { align: "right" });

    doc.text("Inclusive Gst", pageWidth - 60, totalsY + 12);
    doc.text(`${gstTotal.toFixed(2)}`, pageWidth - 10, totalsY + 12, {
      align: "right",
    });

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Net Amount", pageWidth - 60, totalsY + 22);
    doc.text(`${total.toFixed(2)}`, pageWidth - 10, totalsY + 22, {
      align: "right",
    });

    // === QR Bottom Right Box ===
    if (billData.qr) {
      try {
        const qrBoxWidth = 60;
        const qrBoxHeight = 70;
        const qrX = pageWidth - qrBoxWidth - 10;
        const qrY = totalsY + 35;

        // Box with white background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(200);
        doc.setLineWidth(0.3);
        doc.rect(qrX, qrY, qrBoxWidth, qrBoxHeight, "FD");

        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        doc.text("Scan to Pay", qrX + qrBoxWidth / 2, qrY + 8, {
          align: "center",
        });

        doc.addImage(billData.qr, "PNG", qrX + 5, qrY + 13, 50, 50);
      } catch (err) {
        console.error("QR error", err);
      }
    }

    // === Footer Thank You ===
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...primaryColor);
    doc.text(
      "Thank you for shopping with us!",
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      }
    );

    doc.save("invoice.pdf");
    setBillItems([]);
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
              className="btn btn-primary"
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
          <button onClick={printBill} className="btn btn-neutral">
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
          {/* Close button */}
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold focus:outline-none"
            aria-label="Close toast"
          >
            &times;
          </button>

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
