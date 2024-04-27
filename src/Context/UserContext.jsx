import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const [allCourses, setAllCourses] = useState([]);
    const [evaluators, setEvaluators] = useState([]);
    const [scripts, setScripts] = useState([]);

    useEffect(() => {
        getAllCourses();
        getEvaluators();
        getScripts();
        const userTypeFromStorage = localStorage.getItem('userType');
        if (userTypeFromStorage) {
            setUserType(userTypeFromStorage);
        }
    }, []);

    const registerUser = async (formData) => {
        try {
            const { email, password, username, phoneNumber, confirmPassword } = formData; // Add confirmPassword here
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            await axios.post('http://localhost:3223/api/users', {
                email: email,
                password: password,
                name: username,
                number: phoneNumber,
            });
            setIsLoggedIn(true);
            localStorage.setItem('email', email);
            localStorage.setItem('name', username);
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    const loginUser = async (formData) => {
        try {
            const { email, password } = formData;
            const response = await axios.get(`http://localhost:3223/api/users/${email}`);
            if (response.status === 200 && response.data.password === password) {
                setIsLoggedIn(true);
                localStorage.setItem('email', email);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('userType', response.data.userType);
                setUserType(response.data.userType); 
                if (response.data.userType === 'evaluator') {
                    localStorage.setItem('evaluatorId', response.data.evaluatorId);
                }
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setUserType(''); 
    };

    const getAllCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3223/api/course');
            setAllCourses(response.data)
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    };

    const getEvaluators = async () => {
        try {
            const response = await axios.get('http://localhost:3223/api/evaluator');
            setEvaluators(response.data)
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    };

    const getScripts = async () => {
        try {
            const response = await axios.get('http://localhost:3223/api/studentScripts');
            setScripts(response.data);
        } catch (error) {
            console.error('Error fetching scripts:', error);
        }
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, registerUser, loginUser, logoutUser, setIsLoggedIn, allCourses, evaluators, userType ,scripts}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
