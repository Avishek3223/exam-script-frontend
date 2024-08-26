import React, { useContext, useEffect, useState } from 'react';
import AuthForm from './AuthForm';
import Home from './Components/Home';
import UserContext from './Context/UserContext';
import Assigner from './Components/Assigner';
import Evaluator from './Components/Evaluator';
import { Routes, Route } from 'react-router-dom'; // Import necessary components and hooks for routing
import Evaluation from './Components/Evaluation';

function AppContent() {
  const {
    isLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    setIsLoggedIn,
    userType,
  } = useContext(UserContext);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('email')) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const handleAuth = async (formData) => {
    if (isRegister) {
      await registerUser(formData);
    } else {
      await loginUser(formData);
    }
  };

  const handleSignOut = () => {
    logoutUser();
  };

  const toggleForm = () => {
    setIsRegister((prevIsRegister) => !prevIsRegister);
  };

  // Render routes instead of directly rendering components
  return (
    <div className="App">
      <Routes>
        {isLoggedIn ? (
          <>
            {userType === 'assigner' ? (
              <Route path="/" element={<Assigner />} />
            ) : userType === 'evaluator' ? (
              <>
                <Route path="/" element={<Evaluator />} />
                <Route path="/evaluation" element={<Evaluation />} />
              </>
            ) : (
              <Route path="/" element={<Home onSignOut={handleSignOut} />} />
            )}
          </>
        ) : (
          <Route
            path="/"
            element={
              <AuthForm
                onSubmit={handleAuth}
                isRegister={isRegister}
                onToggleForm={toggleForm}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default AppContent;
