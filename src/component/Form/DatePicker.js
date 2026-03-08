import { useEffect, useState } from "react";
import DatePicker from "tailwind-datepicker-react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const MyDatePicker = ({ holder, resetDate, name, onChange, width }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const options = {
    title: holder,
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    maxDate: new Date("2050-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "bg-white w-[350px]",
      todayBtn: "bg-blue-600 text-white hover:bg-blue-700",
      clearBtn: "bg-red-500 text-white hover:bg-red-600",
      icons: "text-blue-600",
      text: "text-gray-700 hover:bg-blue-50",
      disabledText: "text-gray-400 bg-gray-100",
      input: "hidden",
      inputIcon: "hidden",
      selected: "bg-blue-600 text-white hover:bg-blue-700",
    },
    icons: {
      prev: () => <MdArrowForward className="text-secondColor" />,
      next: () => <MdArrowBack className="text-secondColor" />,
    },
    datepickerClassNames: "grid grid-cols-7 w-full gap-1", // Ensure a 7-column layout for weekdays
    defaultDate: new Date(),
    language: "en",
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  useEffect(() => {
    if (resetDate) {
      setSelectedDate(null);
    }
  }, [resetDate]);

  const handleClose = (state) => {
    setShow(state);
  };

  return (
    <div className={`relative w-full  `}>
      {holder && <label className="block mb-1 text-lg font-semibold text-gray-700">{holder}</label>}
      <input
        type="text"
        value={selectedDate ? selectedDate.toLocaleDateString() : ""}
        onClick={() => setShow(!show)}
        readOnly
        className="w-full p-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none text-secondColor bg-gray-100"
        placeholder={holder}
      />
      <DatePicker options={options} onChange={handleDateChange} show={show} setShow={handleClose} />
    </div>
  );
};

export default MyDatePicker;
