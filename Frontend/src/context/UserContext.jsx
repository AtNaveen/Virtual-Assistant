import React, {useState,createContext, useEffect} from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const BACKEND_URL = 'https://virtual-assistant-backend-zh9o.onrender.com';
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async() => {
        try {
            const response = await axios.get(BACKEND_URL + "/api/user/current", 
            {withCredentials: true});
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }  
    } 
    
    const getGeminiResonse = async(command)=>{
        try {
             const response = await axios.post(BACKEND_URL + "/api/user/asktoassistant",{command}, 
            {withCredentials: true});

            return response.data;

        } catch (error) {
            console.log(error); 
        }
    }

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value={
        BACKEND_URL,getGeminiResonse,
        userData,selectedImage, setSelectedImage,
        setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,
    handleCurrentUser}
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
