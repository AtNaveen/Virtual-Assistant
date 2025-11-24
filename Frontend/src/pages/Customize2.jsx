import React,{useState , useContext} from 'react'
import { UserContext } from '../context/UserContext.jsx'
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const{BACKEND_URL,userData,setUserData,backendImage,selectedImage} = useContext(UserContext);
    const[assistantName,setAssistantName] = useState(userData?.assistantName || '');
     const navigate = useNavigate();

    const handleUpdateAssistant = async() => {
      try {
        let formData = new FormData();
        formData.append('assistantName', assistantName);
        if(backendImage){
          formData.append('assistantImage', backendImage);
        } else {
          formData.append('imageUrl', selectedImage);
        }

        const response = await axios.post(BACKEND_URL + '/api/user/update',formData,{withCredentials:true})
        console.log(response.data);
        setUserData(response.data);
        navigate('/home');

       } catch (error) {
        console.log(error)
       }
  }

  return (
     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]'>
      
      <MdKeyboardBackspace onClick={()=>navigate('/customize')} className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]' />

      <h1 className='text-white mb-[40px] text-[30px] text-center'>Enter your <span className='text-blue-200'>Assistant Name</span></h1>
      
      <input onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} type='text' className='w-full max-w-[600px]  px-3 text-white py-2 border bg-black' placeholder='Enter a assistant name' required/>

     {assistantName && <button  onClick={()=>handleUpdateAssistant()} className='bg-white text-black font-extrabold px-8 py-2 mt-20'>Create your Assistant</button> }

     </div>
  )
}

export default Customize2