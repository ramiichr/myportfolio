import React, { useState } from "react";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
}) => {
  // State to track if the calendar is open
  const [isOpen, setIsOpen] = useState(false);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDateChange(e.target.value);
    setIsOpen(false);
  };

  // Handle click on the date input
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle the calendar
    setIsOpen(!isOpen);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative">
      {/* Display the formatted date */}
      <div
        className="border rounded px-3 py-1.5 text-sm cursor-pointer flex items-center bg-white dark:bg-gray-800"
        onClick={handleClick}
      >
        <span>{formatDate(selectedDate)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Calendar popup */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 border">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded"
            autoFocus
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
