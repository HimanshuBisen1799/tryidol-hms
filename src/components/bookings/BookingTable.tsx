import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { bookingService } from '../../services/booking.service';

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isReceiptPopupOpen, setIsReceiptPopupOpen] = useState(false);
  
  // For payment update form
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.getAllBookings();
      setBookings(response.bookings);
    } catch (error) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (booking) => {
    try {
      const data = await bookingService.generateReceipt(booking._id);
      setReceipt({
        bookingId: booking._id,
        userName: booking.user?.username || booking.user_details?.name || 'N/A',
        email: booking.user?.email || booking.user_details?.email || 'N/A',
        roomNumber: booking.room.room_number,
        roomType: booking.room.type,
        checkInDate: new Date(booking.checkin_date).toLocaleDateString(),
        checkOutDate: new Date(booking.checkout_date).toLocaleDateString(),
        price: booking.price_per_bed,
        paymentStatus: booking.payment_status,
        logo: '/path/to/hms-logo.png', // Replace with actual logo path
      });
      setIsReceiptPopupOpen(true);
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again later.');
    }
  };

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setPaymentStatus(booking.payment_status);
    setPaymentMethod('');
    setTransactionId('');
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedBooking || !paymentStatus || !paymentMethod) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await bookingService.updatePaymentStatus(
        selectedBooking._id,
        paymentStatus,
        paymentMethod,
        transactionId
      );
      alert('Payment status updated successfully');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again later.');
    }
  };

  const handlePrint = () => {
    window.print(); // Printing functionality (make sure the receipt is formatted correctly)
  };

  const handleDownloadPDF = () => {
    alert('PDF Download functionality to be implemented');
    // You can use libraries like jsPDF to generate PDFs
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  {booking.user?.username || booking.user_details?.name || 'N/A'}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {booking.user?.email || booking.user_details?.email || 'N/A'}
</td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.room.room_number} ({booking.room.type})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.price_per_bed}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(booking.checkin_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(booking.checkout_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.payment_status === 'pending'
                      ? 'bg-red-100 text-red-800 px-3 py-1 '
                      : 'bg-green-100 text-green-800 px-3 py-1 '
                  }`}
                  onClick={() => handlePaymentClick(booking)} // Triggers payment status update
                >
                  {booking.payment_status}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleViewReceipt(booking)}
                >
                  <Eye size={16} />
                  <span>View Receipt</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Status Update Pop-up */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Update Payment Status</h3>
            <label className="block mb-2">
              Payment Status:
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="block mb-2">
              Payment Method:
              <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    className="border rounded px-2 py-1 w-full"
  >
    <option value="">Select Payment Method</option>
    <option value="online">Online</option>
    <option value="cash">Cash</option>
  </select>
            </label>
            <label className="block mb-4">
              Transaction ID:
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUpdatePaymentStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Pop-up */}
      {isReceiptPopupOpen && receipt && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center relative"
      style={{ width: "520px", height: "595px" }} // Approximate A5 dimensions
    >
      {/* Close Button */}
      <button
        onClick={() => setIsReceiptPopupOpen(false)}
        className="absolute top-9 right-9 text-gray-500 hover:text-gray-800 text-lg font-bold"
      >
        ✕
      </button>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-lg font-bold">Receipt</h3>
      </div>

      {/* Receipt Details */}
      <div className="text-sm text-center flex flex-col w-full h-26 p-4">
        <img
          src="https://lh3.googleusercontent.com/p/AF1QipOxsUxuPpNJ1CSA5xUqNz75gY-plklq9p9I64Ed=s1360-w1360-h1020"
          alt="Logo"
          className="w-[10vw] p-1 h-[8vh] mb-2 my-1 mr-4"
        />
        <p className="my-3 px-4 flex justify-between">
          <strong>Booking ID:</strong> {receipt.bookingId}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>User Name:</strong> {receipt.userName}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Email:</strong> {receipt.email}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Room:</strong> {receipt.roomNumber} ({receipt.roomType})
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Check-in Date:</strong> {receipt.checkInDate}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Check-out Date:</strong> {receipt.checkOutDate}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Price:</strong> ${receipt.price}
        </p>
        <p className="my-3 px-4 flex justify-between">
          <strong>Payment Status:</strong> {receipt.paymentStatus}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full mt-1 space-x-2">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded w-full"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded w-full"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
