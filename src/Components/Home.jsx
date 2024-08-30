import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import UserContext from '../Context/UserContext';

AWS.config.update({
  accessKeyId: 'AKIA4Q7K6SFA35XK7CVY',
  secretAccessKey: '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',
  region: 'us-east-1',
});

function Home() {
  const { setIsLoggedIn, allCourses, scripts } = useContext(UserContext);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [name, setName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedSubject('');
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedSubject('');
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileType = selectedFile.type;
      setFile(selectedFile);
      setUploadStatus('File selected');
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  };

  const handleSubmit = async () => {
    if (!name || !registrationNo || !selectedBranch || !selectedSemester || !selectedSubject || !file) {
      setUploadStatus('Error: Please fill out all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('registrationNo', registrationNo);
    formData.append('branch', selectedBranch);
    formData.append('semester', selectedSemester);
    formData.append('subject', selectedSubject);
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://exam-script-backend-1.onrender.com/api/studentScripts',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        setUploadStatus('Script submitted successfully!');
        alert('Script submitted successfully!');
      } else {
        setUploadStatus('Error: ' + response.statusText);
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
    } finally {
      setName('');
      setRegistrationNo('');
      setSelectedBranch('');
      setSelectedSemester('');
      setSelectedSubject('');
      setFile(null);
      setUploadStatus('');
      window.location.reload();
    }
  };

  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      const subjects =
        allCourses.find(
          (course) =>
            course.branch === selectedBranch &&
            course.semester === parseInt(selectedSemester)
        )?.subjects || [];
      setSelectedSubject(subjects);
    }
  }, [selectedBranch, selectedSemester]);

  const subjects =
    allCourses.find(
      (course) =>
        course.branch === selectedBranch &&
        course.semester === parseInt(selectedSemester)
    )?.subjects || [];

  const uniqueBranches = Array.from(
    new Set(allCourses.map((course) => course.branch))
  );
  const uniqueSemesters = Array.from(
    new Set(allCourses.map((course) => course.semester))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f7fa] to-[#b2ebf2] p-4">
      <div className="flex flex-col lg:flex-row">
        <div className="h-auto lg:h-screen bg-gradient-to-b from-[#e4ffe0] to-[#c8f0c8] w-full lg:w-[20rem] shadow-2xl overflow-hidden mb-8 lg:mb-0 lg:mr-8 rounded-lg">
          <p className="bg-[#4CAF50] text-white text-center font-extrabold text-xl p-6 tracking-wide">
            Government College Of Engineering, Kalahandi
          </p>
          <div className="flex flex-col justify-center items-center h-[40vh] space-y-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">50</p>
              <p className="text-lg font-medium text-gray-600">
                Total Students
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {scripts.length}
              </p>
              <p className="text-lg font-medium text-gray-600">
                Total Submitted
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center h-[20vh] ">
            <button className="bg-[#4CAF50] text-white font-semibold py-2 px-8 rounded-full shadow-md hover:bg-[#388E3C] transition duration-300">
              View Details
            </button>
          </div>
        </div>

        <div className="w-full h-auto flex justify-center items-center">
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Submit Your Script
            </h2>
            <input
              className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81c784] transition duration-200"
              placeholder="Enter student Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81c784] transition duration-200"
              placeholder="Enter student Registration No."
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
            />
            <select
              className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81c784] transition duration-200"
              onChange={handleBranchChange}
              value={selectedBranch}
            >
              <option value="">Select Branch</option>
              {uniqueBranches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <select
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81c784] transition duration-200"
                onChange={handleSemesterChange}
                value={selectedSemester}
              >
                <option value="">Semester</option>
                {uniqueSemesters.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
              <select
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81c784] transition duration-200"
                onChange={handleSubjectChange}
                value={selectedSubject}
              >
                <option value="">Select Subject Code</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.S}>
                    {subject.S}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="flex justify-center p-3 bg-[#f5f5f5] border border-gray-300 rounded-md cursor-pointer hover:bg-[#e0e0e0] transition duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <button
              className="w-full bg-[#81c784] text-white p-3 rounded-md font-semibold hover:bg-[#66bb6a] transition duration-200"
              onClick={handleSubmit}
              disabled={
                !name ||
                !registrationNo ||
                !selectedBranch ||
                !selectedSemester ||
                !selectedSubject ||
                !file
              }
            >
              Submit
            </button>
            {uploadStatus && (
              <p className="mt-3 text-center text-red-500">{uploadStatus}</p>
            )}
          </div>
        </div>
      </div>
      <button
        className="absolute top-4 right-4 p-2 px-3 border border-gray-300 rounded-md bg-[#81c784] text-white hover:bg-[#66bb6a] transition duration-200"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
