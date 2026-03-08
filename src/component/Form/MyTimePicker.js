import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimePicker.scss';
import { MdAccessTime } from 'react-icons/md';

const MyTimePicker = ({ holder, width, onChange, dateSelected }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    // Clear time when date changes
    if (dateSelected) {
      setSelectedTime(null);
    }
  }, [dateSelected]);

  const handleTimeChange = (time) => {
    if (time) {
      const selectedDateWithTime = new Date(dateSelected);
      selectedDateWithTime.setHours(time.getHours());
      selectedDateWithTime.setMinutes(time.getMinutes());

      setSelectedTime(selectedDateWithTime);
      onChange(selectedDateWithTime);
    }
  };

  return (
    <div className={`col-span-3 w-full ${width ? `md:w-[${width}%]` : 'md:w-full'}`}>
      {holder && (
        <label
          htmlFor={holder}
          className="block  text-lg font-semibold text-gray-800 transition-colors duration-200"
        >
          {holder}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={selectedTime}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="w-full p-3 pr-10 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
          placeholderText={holder}
          disabled={!dateSelected}
          calendarClassName="react-datepicker animate-fadeIn"
          timeClassName={(time) => {
            const currentHour = time.getHours();
            return currentHour === selectedTime?.getHours()
              ? 'react-datepicker__time-list-item--selected'
              : 'react-datepicker__time-list-item';
          }}
          wrapperClassName="w-full"
          aria-label={`Select time for ${holder}`}
        />
        <MdAccessTime className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    </div>
  );
};

export default MyTimePicker;
