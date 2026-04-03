import { useEffect, useState } from "react";
import { FaChair } from "react-icons/fa";

export default function SeatGrid() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    fetch("https://seat-booking-kg35.onrender.com/seats")
      .then((res) => res.json())
      .then((data) => setSeats(data));
  }, []);

  const toggleSeatSelection = (id) => {
    const seat = seats.find((s) => s.id === id);
    if (seat.booked) return;

    setSelectedSeats((prev) => {
      if (prev.includes(id)) {
        return prev.filter((seatId) => seatId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const bookSeats = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      const selectedSeatObjects = seats.filter((seat) =>
        selectedSeats.includes(seat.id),
      );
      const bookingPromises = selectedSeatObjects.map((seat) =>
        fetch(`http://localhost:5001/book/${seat.seatLabel}`, {
          method: "POST",
        }).then((res) => res.json()),
      );

      const results = await Promise.all(bookingPromises);

      const bookingTime = results[0]?.timestamp || new Date().toLocaleString();

      setSeats((prev) =>
        prev.map((seat) =>
          selectedSeats.includes(seat.id) ? { ...seat, booked: true } : seat,
        ),
      );

      const seatLabels = selectedSeatObjects.map((seat) => seat.seatLabel);

      const details = {
        seats: selectedSeats,
        seatLabels: seatLabels,
        totalAmount: selectedSeats.length * 150,
        bookingTime: bookingTime,
      };

      setBookingDetails(details);
      setShowBookingModal(true);
      setSelectedSeats([]);
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setBookingDetails(null);
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="text-5xl font-extrabold mb-4 tracking-tight"
            style={{
              background:
                "linear-gradient(99.87deg, #FFFFFF 11.68%, rgba(255, 255, 255, 0) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: "900",
            }}
          >
            Select Your Seats
          </h1>
          <p className="text-lg text-gray-600 font-normal">
            Book your seats and enjoy the show
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-10 mb-12">
          <div className="flex items-center gap-3">
            <FaChair size={28} style={{ color: "#10b981" }} />
            <span
              className="font-semibold text-base"
              style={{ color: "#ffffff" }}
            >
              Available
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaChair size={28} style={{ color: "#fbbf24" }} />
            <span
              className="font-semibold text-base"
              style={{ color: "#ffffff" }}
            >
              Selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaChair size={28} style={{ color: "#ef4444" }} />
            <span
              className="font-semibold text-base"
              style={{ color: "#ffffff" }}
            >
              Booked
            </span>
          </div>
        </div>

        {/* Screen */}
        <div className="mb-16 text-center">
          <div className="w-2/3 mx-auto h-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
          <p className="text-gray-400 text-xs mt-2 tracking-[0.3em]">SCREEN</p>
        </div>

        {/* Seats */}
        <div className="max-w-4xl mx-auto mt-12">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row, rowIndex) => (
            <div
              key={row}
              className="flex items-center justify-center mb-5 gap-10"
            >
              {/* Row Label */}
              <span className="text-gray-500 font-semibold text-lg w-8 text-center">
                {row}
              </span>
              {/* Left gap */}
              <div className="w-12"></div>
              {/* Left seats */}
              <div className="flex gap-10">
                {seats
                  .slice(rowIndex * 8, rowIndex * 8 + 4)
                  .map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div
                        key={seat.id}
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`relative flex flex-col items-center cursor-pointer transition-all duration-300
                  ${seat.booked ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}
                  ${isSelected ? "scale-110" : ""}
                `}
                      >
                        {/* Seat */}
                        <div
                          className={`w-5 h-5 rounded transition-all duration-300
                    ${
                      seat.booked
                        ? "bg-red-500"
                        : isSelected
                          ? "bg-[#fbbf24]"
                          : "bg-green-500 hover:bg-green-400"
                    }
                  `}
                        ></div>
                        {/* Seat Number */}
                        <span
                          className={`text-xs mt-1
                    ${
                      seat.booked
                        ? "text-gray-400"
                        : isSelected
                          ? "text-yellow-400"
                          : "text-gray-300"
                    }
                  `}
                        >
                          {index + 1}
                        </span>
                      </div>
                    );
                  })}
              </div>
              {/* Gap btw seats */}
              <div className="w-32"></div>
              {/* Right seats */}
              <div className="flex gap-10">
                {seats
                  .slice(rowIndex * 8 + 4, rowIndex * 8 + 8)
                  .map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div
                        key={seat.id}
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`relative flex flex-col items-center cursor-pointer transition-all duration-300
                  ${seat.booked ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}
                  ${isSelected ? "scale-110" : ""}
                `}
                      >
                        {/* Seat */}
                        <div
                          className={`w-5 h-5 rounded transition-all duration-300
                    ${
                      seat.booked
                        ? "bg-red-500"
                        : isSelected
                          ? "bg-[#fbbf24]"
                          : "bg-green-500 hover:bg-green-400"
                    }
                  `}
                        ></div>
                        {/* Seat Number */}
                        <span
                          className={`text-xs mt-1
                    ${
                      seat.booked
                        ? "text-gray-400"
                        : isSelected
                          ? "text-yellow-400"
                          : "text-gray-300"
                    }
                  `}
                        >
                          {index + 5}
                        </span>
                      </div>
                    );
                  })}
              </div>
              {/* Right gap */}
              <div className="w-12"></div>
            </div>
          ))}
        </div>

        {/* Booking Button */}
        <div className="text-center mt-8">
          <button
            onClick={bookSeats}
            disabled={selectedSeats.length === 0}
            className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300
              ${
                selectedSeats.length > 0
                  ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-600/40"
                  : "bg-gray-600 text-white opacity-60 cursor-not-allowed"
              }
            `}
          >
            {selectedSeats.length > 0
              ? `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""}`
              : "Select Seats to Book"}
          </button>
        </div>

        {/* Success msg */}
        {showBookingModal && bookingDetails && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                🎉 Booking Confirmed!
              </h3>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Seat Labels:</p>
                <p className="text-white text-lg font-semibold">
                  {bookingDetails.seatLabels.join(", ")}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Total Amount:</p>
                <p className="text-green-500 text-xl font-bold">
                  ₹{bookingDetails.totalAmount}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Booking Time:</p>
                <p className="text-white text-sm">
                  {bookingDetails.bookingTime}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
