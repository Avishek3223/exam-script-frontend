import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

import UserContext from '../Context/UserContext';
AWS.config.update({
  accessKeyId: 'AKIA4Q7K6SFA35XK7CVY',
  secretAccessKey: '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',
  region: 'us-east-1'
});

function Home() {
  const { setIsLoggedIn, allCourses,scripts } = useContext(UserContext);
  console.log(allCourses)
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [name, setName] = useState('');
  const [registrationNo, setRegistrationNo] = useState();
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
    console.log(e.target.value)
    setSelectedSubject(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
  
    // Create a new FileReader instance
    const reader = new FileReader();
  
    // Set up FileReader onload event handler
    reader.onload = (event) => {
      // Access the file type from the event target's result property
      const fileType = selectedFile.type;
      console.log('File type:', fileType);
  
      // Update state or perform other actions with the file type
      setFile(selectedFile);
      setUploadStatus('File selected');
    };
  
    // Read the file as a data URL, triggering the onload event handler
    reader.readAsDataURL(selectedFile);
  };
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled out
    if (!name || !registrationNo || !selectedBranch || !selectedSemester || !selectedSubject || !file) {
      setUploadStatus('Error: Please fill out all fields');
      return;
    }
  
    // Create an instance of the FormData object
    const formData = new FormData();
  
    // Append form data to the FormData object
    formData.append('name', name);
    formData.append('registrationNo', registrationNo);
    formData.append('branch', selectedBranch);
    formData.append('semester', selectedSemester);
    formData.append('subject', selectedSubject);
    formData.append('file', file);
  
    try {
      // Submit the form data to your Express backend using axios
      const response = await axios.post('https://exam-script-backend-1.onrender.com/api/studentScripts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      });
  
      if (response.status === 201) {
        // Handle success
        setUploadStatus('Script submitted successfully!');
        alert('Script submitted successfully!')
      } else {
        // Handle error
        setUploadStatus('Error: ' + response.statusText);
        console.error('Error submitting script:', response.statusText);
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
      console.error('Error submitting script:', error);
    } finally {
      setName('');
      setRegistrationNo('');
      setSelectedBranch('');
      setSelectedSemester('');
      setSelectedSubject('');
      setFile(null);
      setUploadStatus('')
      window.location.reload();
    }
  };
  
  
  // Fetch subjects only when both branch and semester are selected
  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      const subjects = allCourses.find(course =>
        course.branch === selectedBranch && course.semester === parseInt(selectedSemester)
      )?.subjects || [];
      setSelectedSubject(subjects);
    }
    // eslint-disable-next-line 
  }, [selectedBranch, selectedSemester]);

  const subjects = allCourses.find(course =>
    course.branch === selectedBranch && course.semester === parseInt(selectedSemester)
  )?.subjects || [];

  // Extracting unique branches and semesters
  const uniqueBranches = Array.from(new Set(allCourses.map(course => course.branch)));
  const uniqueSemesters = Array.from(new Set(allCourses.map(course => course.semester)));

  return (
    <div className='w-screen h-screen bg-[#F3F3F3]'>
      <div className="flex">
        <div className="h-screen bg-[#e4ffe0]">
          <p className='bg-[#d6d6d6] border-b border-black tracking-[1px] w-[18rem] font-[500] text-[1.16rem] p-6'>Government College Of Engineering, Kalahandi</p>
          <div className='flex flex-col justify-center items-center h-[40vh]'>
            <p className='mb-5 font-[500] tracking-[1px]'>Total Students = 50</p>
            <p className='mb-5 font-[500] tracking-[1px]'>Total Submited = {scripts.length}</p>
          </div>
        </div>
        {/* starts the form to fill up */}
        <div className='w-[100vw] h-screen flex justify-center items-center'>
          <div className="flex flex-col justify-center">
            <input
              className='mb-7 w-[27rem] p-3 border border-black tracking-[1px] px-6'
              placeholder='Enter student Name'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className='mb-7 w-[27rem] p-3 border border-black tracking-[1px] px-6'
              placeholder='Enter student Registration No.'
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
            />
            <select
              className='mb-7 w-[27rem] p-3 border border-black tracking-[1px] px-6'
              onChange={handleBranchChange}
              value={selectedBranch}
            >
              <option value=''>Select Branch</option>
              {uniqueBranches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <div className="flex w-full gap-11">
              <select
                className='mb-7 w-[12rem] p-3 border border-black tracking-[1px] px-6'
                onChange={handleSemesterChange}
                value={selectedSemester}
              >
                <option value=''>Semester</option>
                {uniqueSemesters.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
              <select
                className='mb-7 w-[12rem] p-3 border border-black tracking-[1px] px-6'
                onChange={handleSubjectChange}
                value={selectedSubject}
              >
                <option value=''>Select Subject Code</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.S}>
                    {subject.S}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="flex justify-center p-3 bg-[white] border border-black cursor-pointer" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(5px)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <button
              className='bg-[#BFFFCD] border border-black text-[#1b1b1b] p-2 font-[600] tracking-[1px] text-[1.1rem]'
              onClick={handleSubmit}
              disabled={!name || !registrationNo || !selectedBranch || !selectedSemester || !selectedSubject || !file}
            >
              Submit
            </button>
            {uploadStatus && <p className="mt-3 text-red-500">{uploadStatus}</p>}
          </div>
        </div>
      </div>
      <button className='absolute top-4 right-4 p-2 px-3 border border-black' onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
