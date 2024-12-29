{
  "user": {
    "id": "user12345", // ID of the user making the booking
    "name": "John Doe",
    "email": "johndoe@example.com"
  },
  "room": {
    "room_number": "101", // Room number
    "_id": "roomid12345", // Unique ID of the room in the database
    "beds": [
      {
        "bed_number": 1, // Bed number in the room
        "status": "available", // Status of the bed (e.g., available, occupied)
        "price_per_bed": 500 // Price per bed per night
      },
      {
        "bed_number": 2,
        "status": "occupied",
        "price_per_bed": 500
      }
    ]
  },
  "booking": {
    "room": "roomid12345", // ID of the room being booked
    "bed_number": 1, // Bed number being booked
    "checkin_date": "2024-12-30T12:00:00Z", // Check-in date and time
    "checkout_date": "2025-01-02T12:00:00Z", // Check-out date and time
    "status": "pending", // Status of the booking (e.g., pending, confirmed)
    "price_per_bed": 500, // Price for the bed being booked
    "total_price": 1500 // Total price calculated as price_per_bed * nights stayed
  },
  "overlappingBookings": [] // List of any overlapping bookings if applicable
}
