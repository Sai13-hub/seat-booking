import { useEffect, useState } from "react";
import { FaChair } from "react-icons/fa";

export default function SeatGrid() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const BASE_URL = "https://seat-booking-kg35.onrender.com";

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
        fetch(`${BASE_URL}/book/${seat.seatLabel}`, { method: "POST" }).then(
          (res) => res.json(),
        ),
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
    <div className="min-h-screen text-white px-2 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-10 bg-black">
      <div className="max-w-7xl xl:max-w-screen-2xl 2xl:max-w-full mx-auto px-2 sm:px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-14">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 md:mb-4 tracking-tight"
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
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-normal">
            Book your seats and enjoy the show
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <FaChair
              size={16}
              className="sm:size-6 md:size-6 lg:size-8"
              style={{ color: "#10b981" }}
            />
            <span
              className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
              style={{ color: "#ffffff" }}
            >
              Available
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <FaChair
              size={16}
              className="sm:size-6 md:size-6 lg:size-8"
              style={{ color: "#fbbf24" }}
            />
            <span
              className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
              style={{ color: "#ffffff" }}
            >
              Selected
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <FaChair
              size={16}
              className="sm:size-6 md:size-6 lg:size-8"
              style={{ color: "#ef4444" }}
            />
            <span
              className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
              style={{ color: "#ffffff" }}
            >
              Booked
            </span>
          </div>
        </div>

        {/* Screen */}
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <div className="w-5/6 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto h-2 sm:h-3 md:h-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
          <p className="text-gray-400 text-xs mt-1 sm:mt-2 tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em]">
            SCREEN
          </p>
        </div>

        {/* Seats */}
        <div className="max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-12">
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row, rowIndex) => (
            <div
              key={row}
              className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-5 gap-1 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8"
            >
              <span className="text-gray-500 font-semibold text-xs sm:text-sm md:text-base lg:text-lg w-4 sm:w-6 md:w-8 lg:w-10 text-center">
                {row}
              </span>
              <div className="w-2 sm:w-4 md:w-6 lg:w-8 xl:w-12"></div>

              {/* Left seats */}
              <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6">
                {seats
                  .slice(rowIndex * 8, rowIndex * 8 + 4)
                  .map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div
                        key={seat.id}
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                          seat.booked
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:scale-110"
                        } ${isSelected ? "scale-110" : ""}`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded transition-all duration-300 ${
                            seat.booked
                              ? "bg-red-500"
                              : isSelected
                                ? "bg-[#fbbf24]"
                                : "bg-green-500 hover:bg-green-400"
                          }`}
                        ></div>
                        <span
                          className={`text-xs sm:text-xs md:text-sm lg:text-sm mt-1 ${
                            seat.booked
                              ? "text-gray-400"
                              : isSelected
                                ? "text-yellow-400"
                                : "text-gray-300"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Middle gap */}
              <div className="w-4 sm:w-8 md:w-12 lg:w-16 xl:w-24 2xl:w-32"></div>

              {/* Right seats */}
              <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6">
                {seats
                  .slice(rowIndex * 8 + 4, rowIndex * 8 + 8)
                  .map((seat, index) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div
                        key={seat.id}
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                          seat.booked
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:scale-110"
                        } ${isSelected ? "scale-110" : ""}`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded transition-all duration-300 ${
                            seat.booked
                              ? "bg-red-500"
                              : isSelected
                                ? "bg-[#fbbf24]"
                                : "bg-green-500 hover:bg-green-400"
                          }`}
                        ></div>
                        <span
                          className={`text-xs sm:text-xs md:text-sm lg:text-sm mt-1 ${
                            seat.booked
                              ? "text-gray-400"
                              : isSelected
                                ? "text-yellow-400"
                                : "text-gray-300"
                          }`}
                        >
                          {index + 5}
                        </span>
                      </div>
                    );
                  })}
              </div>

              <div className="w-2 sm:w-4 md:w-6 lg:w-8 xl:w-12"></div>
            </div>
          ))}
        </div>

        {/* Booking Button */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8">
          <button
            onClick={bookSeats}
            disabled={selectedSeats.length === 0}
            className={`px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 ${
              selectedSeats.length > 0
                ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-600/40"
                : "bg-gray-600 text-white opacity-60 cursor-not-allowed"
            }`}
          >
            {selectedSeats.length > 0
              ? `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? "s" : ""}`
              : "Select Seats to Book"}
          </button>
        </div>

        {/* Success msg */}
        {showBookingModal && bookingDetails && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={closeModal}
          >
            <div
              className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl max-w-xs sm:max-w-sm md:max-w-md w-full mx-2 sm:mx-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4 text-center">
                🎉 Booking Confirmed!
              </h3>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Seat Labels:
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg font-semibold break-words">
                  {bookingDetails.seatLabels.join(", ")}
                </p>
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Total Amount:
                </p>
                <p className="text-green-500 text-base sm:text-lg md:text-xl font-bold">
                  ₹{bookingDetails.totalAmount}
                </p>
              </div>

              <div className="mb-3 sm:mb-4 md:mb-6">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  Booking Time:
                </p>
                <p className="text-white text-xs sm:text-sm">
                  {bookingDetails.bookingTime}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-full bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 md:px-6 rounded-lg font-semibold transition-colors duration-300 hover:bg-green-700 text-xs sm:text-sm md:text-base"
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
