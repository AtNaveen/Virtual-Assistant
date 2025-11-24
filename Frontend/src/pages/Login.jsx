import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import bg from "../assets/authBg.png"
import { UserContext } from '../context/UserContext.jsx';
import  { useNavigate }  from 'react-router-dom';


const Login = () => {

 const[currentState,setCurrentState] = useState('Login');
 const{BACKEND_URL ,userData, setUserData} = useContext(UserContext);
   const navigate = useNavigate();

   const[name,setName] = useState('')
   const[password,setPassword] = useState('')
   const[email,setEmail] = useState('')

   const onSubmitHandler = async(e) =>{
    e.preventDefault();
    try {
      if(currentState !== 'Login'){

        const response = await axios.post(BACKEND_URL + "/api/auth/signup",{name,email,password},{withCredentials: true,headers: { "Content-Type": "application/json" }})
        setUserData(response.data);
        navigate('/customize');
    
      } else {
        const response = await axios.post(BACKEND_URL + "/api/auth/signin",{email,password},{withCredentials: true , headers: { "Content-Type": "application/json" }})
        setUserData(response.data);
        navigate('/home');
      
      } 
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
   }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
     <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>

        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl '>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-black' />
        </div> 

       {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type='text' className='w-full text-white px-3 py-2 border bg-black' placeholder='Name' required /> }
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' className='w-full px-3 text-white py-2 border bg-black' placeholder='Email' required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type='password' className='w-full text-white px-3 py-2 border bg-black' placeholder='Password' required />
       
       <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer text-white '>Forgot your password?</p>
          {
            currentState === 'Login' 
            ? <p onClick={()=>setCurrentState('Sign up')} className='cursor-pointer text-white'>Create account</p>
            : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer text-white' >Login Here</p>
            }
       </div>
   <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
    </div>
  )
}

export default Login;