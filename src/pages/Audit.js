import React, { useEffect, useState } from 'react';
import {FaFileExport, FaRedoAlt, FaFileUpload, FaStepBackward, FaStepForward, FaClipboardList, FaUsers, FaCalendarAlt, FaTrashAlt, FaPlus } from 'react-icons/fa';
import InputField from '../component/Form/InputField';
import MyTimePicker from '../component/Form/MyTimePicker';
import MyDatePicker from '../component/Form/DatePicker';
import FileUpload from '../component/Form/FileUpload';
import * as XLSX from 'xlsx';
import CustomSelect from '../component/Form/CustomSelect';
import NavBar from '../component/NavBar/NavBAr2';
import { useNavigate } from 'react-router-dom';
 
const AuditPage = () => {
  const [newAttendee, setNewAttendee] = useState('');
  const [date,setDate]=useState('');
  const [MeetingDate,setMeetingDate]=useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: '',
    time: '',
    auditType: '',
    scheme: '',
    auditTeam: [{ name: '', position: '', responsibility: '' }],
    openingMeeting: { time: '', attendeesList: [] },
    agenda: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [resetDate, setResetDate] = useState(false);

  const steps = [
    { label: 'Step 1', icon: <FaClipboardList />, description: 'Organization Details' },
    { label: 'Step 2', icon: <FaUsers />, description: 'Audit Team' },
    { label: 'Step 3', icon: <FaCalendarAlt />, description: 'Opening Meeting' },
  ];

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
  
    if (index !== null) {
      // Updating a specific team member field
      setFormData((prevData) => {
        const updatedAuditTeam = [...prevData.auditTeam];
        updatedAuditTeam[index][name] = value;
        return { ...prevData, auditTeam: updatedAuditTeam };
      });
    } else {
      // Updating a main form field
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const formatDateTime = (dateTime) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    const date = new Date(dateTime);

    const day = daysOfWeek[date.getDay()];
    const formattedDate = `${date.getDate()} / ${months[date.getMonth()]} / ${date.getFullYear()}`;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const formattedTime = `${hours}:${minutes} ${period}`;

    return { day, formattedDate, formattedTime };
  };

  const formattedAppointment = formatDateTime(formData.time);
  

  const handleTeamMemberChange = (index, event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedTeam = [...prevData.auditTeam];
      updatedTeam[index] = {
        ...updatedTeam[index],
        [name]: value,
      };
      return {
        ...prevData,
        auditTeam: updatedTeam,
      };
    });
  };
  

  const addTeamMember = () => {
    setFormData((prevData) => ({
      ...prevData,
      auditTeam: [...prevData.auditTeam, { name: '', position: '', responsibility: '' }],
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      setFormData((prevData) => ({ ...prevData, agenda: file }));
    } else {
      alert('Please upload a valid Excel file.');
    }
  };

  const resetForm = () => {
    setFormData({
      organizationName: '',
      date: '',
      time: '',
      auditType: '',
      scheme: '',
      auditTeam: [{ name: '', position: '', responsibility: '' }],
      openingMeeting: { date: '', time: '', attendeesList: [] },
      agenda: null,
    });
    setResetDate(true);
    setCurrentStep(1)

  };

  const handleRecommend = () => {
    console.log('Audit shema'  , formData.scheme);
    sessionStorage.setItem('auditData', JSON.stringify(formData));
    navigate('/recommend');

    //navigate('/recommend', { state: formData }); // Pass formData along with any existing state

  };

  useEffect(() => {
    sessionStorage.clear(); // Clears all items in sessionStorage

  }, []);

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.organizationName  && formData.time && formData.auditType && formData.scheme;
    } else if (currentStep === 2) {
      return formData.auditTeam.every(member => member.name && member.position && member.responsibility);
    } else if (currentStep === 3) {
      return formData.openingMeeting.date && formData.openingMeeting.time && formData.openingMeeting.attendeesList.length > 0;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen 
    ">
      

      <form className="p-8 text-start max-w-2xl mx-auto bg-white shadow-2xl rounded-lg border border-gray-200 space-y-8">
      
      
      {/* Progress Bar */}
      <div className="flex justify-between mb-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 flex flex-col items-center transition-all duration-300 ease-in-out ${
              index + 1 <= currentStep ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                index + 1 <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {step.icon}
            </div>
            <p className="mt-2 text-sm font-medium">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Reset button outside step controls */}
<div className="mt-5 flex justify-center w-full">
  <button
    onClick={resetForm}
    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 shadow-md transition-all duration-300"
  >
    <FaRedoAlt /> Reset Form
  </button>
</div>
      {/* =========step 1 */}
        {currentStep === 1 && (
          <div>
            <InputField
              label="Organization Name"
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              placeholder="Enter organization name"
              required
            />

            <div className="flex gap-4">
              <MyDatePicker holder="Date" onChange={(data)=>{setDate(data)}} width={100} resetDate={resetDate} />
              <MyTimePicker holder="Time" onChange={handleTimeSelect} dateSelected={date} width={100} />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">Audit Type</label>
              <CustomSelect
                name="auditType"
                value={formData.auditType}
                onChange={handleInputChange}
                options={['Internal Audit', 'External Audit']}
                placeholder="Select Audit Type"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">Scheme</label>
              <CustomSelect
                name="scheme"
                value={formData.scheme}
                onChange={handleInputChange}
                options={['ISO 15189-2022', 'JCI (Laboratories, 4Th Edition)', 'GAHAR (Edition 2021)' , 'GAHAR (2021 to GAHAR 2025)' , 'GAHAR (Edition 2025)' , "Recommendation Prediction" , "All"]}
                placeholder="Select Scheme"
              />
            </div>

          </div>
        )}
{/* ================ STEP 2 ===================== */}
{currentStep === 2 && (
  <div>
    {formData.auditTeam.map((member, index) => (
      <div key={index} className="mb-2 bg-gray-100 p-4 rounded-lg shadow-inner">
        <label className="block font-medium text-blue-700 mb-2">Team Member {index + 1}</label>
        <InputField
          label="Name"
          type="text"
          name="name"
          value={member.name}
          onChange={(e) => handleTeamMemberChange(index, e)}
          placeholder="Name"
          required
        />
        
        <label className="block text-lg font-semibold text-gray-700 mb-1">Position</label>
        <CustomSelect
          name="position"
          value={member.position}
          onChange={(e) => handleTeamMemberChange(index, e)}
          options={['Lead Auditor', 'Technical Assessor', 'Subject Matter Expert', 'Team Leader', 'Other']}
          placeholder="Select Position"
        />

        <InputField
          label="Responsibility"
          type="text"
          name="responsibility"
          value={member.responsibility}
          onChange={(e) => handleTeamMemberChange(index, e)}
          placeholder="Responsibility"
        />
      </div>
    ))}

    <button
      type="button"
      onClick={addTeamMember}
      className="mt-2 mb-4 px-4 py-2 bg-primeColor text-white font-medium rounded-lg hover:bg-green-600 transition-all"
    >
      Add Team Member
    </button>
  </div>
)}


{/*========================== step 3 ====================================*/}
        {currentStep === 3 && (
  <div>
    <MyDatePicker
      holder="Opening Meeting Date"
      onChange={(date) => setMeetingDate(date)}
/>
  <MyTimePicker
    holder="Opening Meeting Time"
    onChange={(time) => setFormData(prev => ({
      ...prev,
      openingMeeting: { ...prev.openingMeeting, time }
    }))}
    dateSelected={MeetingDate} // Pass the date, not time
    width={100}
  />

    {/* Add Attendees List */}
    <div className="mt-4">
      <label className="block font-semibold text-gray-700">Attendees List</label>
      {formData.openingMeeting.attendeesList.map((attendee, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <InputField
            type="text"
            value={attendee}
            onChange={(e) => {
              const updatedList = [...formData.openingMeeting.attendeesList];
              updatedList[index] = e.target.value;
              setFormData(prev => ({
                ...prev,
                openingMeeting: { ...prev.openingMeeting, attendeesList: updatedList }
              }));
            }}
            placeholder={`Attendee ${index + 1}`}
            required
          />
          <button
            type="button"
            onClick={() => {
              const updatedList = formData.openingMeeting.attendeesList.filter((_, i) => i !== index);
              setFormData(prev => ({
                ...prev,
                openingMeeting: { ...prev.openingMeeting, attendeesList: updatedList }
              }));
            }}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}

      {/* Add New Attendee Field */}
      <div className="flex items-center gap-2">
        <InputField
          type="text"
          value={newAttendee}
          onChange={(e) => setNewAttendee(e.target.value)}
          placeholder="Enter attendee's name"
        />
        <button
          type="button"
          onClick={() => {
            if (newAttendee.trim()) {
              setFormData(prev => ({
                ...prev,
                openingMeeting: {
                  ...prev.openingMeeting,
                  attendeesList: [...prev.openingMeeting.attendeesList, newAttendee]
                }
              }));
              setNewAttendee('');
            }
          }}
          className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
        >
          <FaPlus />
        </button>
      </div>
    </div>

    {/* {agenda} */}
    <FileUpload
      file={formData.agenda}
      label="Upload Agenda (Excel file)"
      handleFileUpload={handleFileUpload}
      fileType="agendaFile"
      Icon={<FaFileUpload />}
    />
  </div>
)}


<div className="flex mt-5">
  {/* Left-aligned Previous button */}
  {currentStep > 1 && (
    <button
      type="button"
      onClick={prevStep}
      className="flex justify-start items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 shadow-md transition-all duration-300"
    >
      Previous
    </button>
  )}

  {/* Spacer to push Next button to the right */}
  <div className="flex-1"></div>

  {/* Right-aligned Next or Submit buttons */}
  {currentStep < 3 ? (
    <button
  type="button"
  onClick={nextStep}
  disabled={!isStepValid()}
  className={`flex justify-end items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 ${isStepValid() ? 'bg-primeColor hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold rounded-lg transition-all`}
>
  Next 
</button>

  ) : (
    <>
      <button
        type="button"
        onClick={handleRecommend}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300"
      >
        Submit <FaFileExport />
      </button>
    </>
  )}
</div>




      </form>

    </div>
  );
};

export default AuditPage;
