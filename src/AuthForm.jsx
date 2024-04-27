import React, { useState, useContext } from 'react';
import UserContext from './Context/UserContext';

const AuthForm = ({ isRegister, onToggleForm }) => {
  const { registerUser, loginUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await registerUser(formData);
      } else {
        await loginUser(formData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className='min-w-[25rem] h-content'>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-[#ffffff] p-8 border-2 rounded-lg">
          <p className='text-[1.3rem] font-light mb-2'>Welcome !</p>
          <h2 className='text-[2rem] font-[500] mb-2'>{isRegister ? 'Sign up' : 'Login in'}</h2>
          <div className="mb-6 mt-8">
            <label className="block text-[#242424] text-[1.1rem] font-[400] mb-2" htmlFor="email">Email:</label>
            <input placeholder='Enter your email' type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border-[0.1px] border-black h-[3rem] px-3 py-2 rounded-[6px] text-gray-700" />
          </div>
          {isRegister && (
            <>
              <div className="mb-6">
                <label className="block text-[#242424] text-[1.1rem] font-[400] mb-2" htmlFor="username">Username:</label>
                <input placeholder='Enter your name' type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full border-[0.1px] border-black h-[3rem] px-3 py-2 rounded-[6px] text-gray-700" />
              </div>
              <div className="mb-6">
                <label className="block text-[#242424] text-[1.1rem] font-[400] mb-2" htmlFor="phoneNumber">Phone Number:</label>
                <input placeholder='Enter your phoneNumber' type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full border-[0.1px] border-black h-[3rem] px-3 py-2 rounded-[6px] text-gray-700" />
              </div>
              <div className="mb-6">
                <label className="block text-[#242424] text-[1.1rem] font-[400] mb-2" htmlFor="confirmPassword">Confirm Password:</label>
                <input placeholder='Confirm your password' type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full border-[0.1px] border-black h-[3rem] px-3 py-2 rounded-[6px] text-gray-700" />
              </div>
            </>
          )}
          <div className="mb-6">
            <label className="block text-[#242424] text-[1.1rem] font-[400] mb-2" htmlFor="password">Password:</label>
            <input placeholder='Enter your password' type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border-[0.1px] border-black h-[3rem] px-3 py-2 rounded-[6px] text-gray-700" />
          </div>
          <button type="submit" className="bg-[#1f1f1f] text-white w-full hover:bg-[#383838] tracking-[1px] font-[400] py-3 px-4 rounded focus:outline-none focus:shadow-outline">{isRegister ? 'Register' : 'Login'}</button>
          <div className='flex gap-1 justify-center mt-2 font-[300]'>
            {isRegister ? (
              <div>Already have an account ?</div>
            ) : (
              <div>Don't have an account</div>
            )}
            <button type="button" onClick={onToggleForm} className="text-[#000000] hover:text-[gray] font-[600] rounded focus:outline-none focus:shadow-outline">{isRegister ? 'Login' : 'Register'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
