import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Customize from './pages/Customize.jsx'
import Customize2 from './pages/Customize2.jsx'
import Home from './pages/Home.jsx'
import { UserContext } from './context/UserContext.jsx' 
import { useContext } from 'react'

function App() {
  
  const {userData , setUserData} = useContext(UserContext);

  return (
    <Routes>
      <Route path='/home' element={<Home />}/>
      
      <Route path='/' element={<Login />}/>
      <Route path='/login' element={<Login />}/>

      <Route path='/customize' element={(userData?<Customize /> : <Navigate to={'/login'}/> )}/>
       
      <Route path='/customize2' element={(userData?<Customize2 /> : <Navigate to={'/login'}/> )}/>
    </Routes>
  )
}

export default App;
