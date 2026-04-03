const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let seats = Array.from({ length: 64 }, (_, i) => {
  const rowNumber = Math.floor(i / 8);
  const rowLetter = String.fromCharCode(65 + rowNumber);
  const seatNumber = (i % 8) + 1;
  const seatLabel = `${rowLetter}${seatNumber}`;

  return {
    id: seatLabel,
    row: rowLetter,
    seatNumber: seatNumber,
    seatLabel: seatLabel,
    booked: false,
    bookingTime: null,
  };
});

let bookings = [];

app.get("/seats", (req, res) => {
  res.json(seats);
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Book a seat
app.post("/book/:id", (req, res) => {
  const seatId = req.params.id;

  const seat = seats.find((s) => s.id === seatId);

  if (!seat) return res.status(404).json({ message: "Seat not found" });

  if (seat.booked) return res.status(400).json({ message: "Already booked" });

  const bookingTime = new Date().toISOString();

  seat.booked = true;
  seat.bookingTime = bookingTime;

  // Add to bookings with row
  const booking = {
    seatId: seat.id,
    row: seat.row,
    seatNumber: seat.seatNumber,
    seatLabel: seat.seatLabel,
    bookingTime: bookingTime,
    timestamp: new Date().toLocaleString(),
  };

  bookings.push(booking);

  res.json({
    message: "Seat booked",
    seat,
    bookingTime: bookingTime,
    timestamp: new Date().toLocaleString(),
  });
});

app.listen(5001, () => console.log("Server running on port 5001"));
