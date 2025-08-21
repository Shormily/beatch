import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './component/layout/pages/Home'
import Navbar from './component/layout/navbar'
import Footer from './component/layout/footer'

function App() {
  

  return (
    <>
      <Navbar/>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/footer" element={<Footer />} />
      
    </Routes>  
   <Footer/>
    </>
  )
}

export default App
