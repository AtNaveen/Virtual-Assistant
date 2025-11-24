import React,{ useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';

const Card = ({image}) => {

    const{BACKEND_URL,userData,setUserData,selectedImage, setSelectedImage,
           frontendImage, setFrontendImage,backendImage, setBackendImage,} = useContext(UserContext);

  return (
    <div>
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
            bg-[#020220] border-2 border-[#0000ff66] rounded-2x1
            overflow-hidden hover:shadow-2xl hover:shadow-blue-950
            cursor-pointer hover:border-4 hover:border-white 
            ${selectedImage == image ? "border-4 hover:border-white hover:shadow-2xl hover:shadow-blue-950" : null}`} 
            onClick={()=> {
            setSelectedImage(image)
            setFrontendImage(null)
            setBackendImage(null)
            }}>

        <img src={image} className='h-full object-cover' />
        </div>

    </div>
  )
}

export default Card