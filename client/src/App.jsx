import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import EditorPage from './Pages/EditorPage'
import './App.css'
import Home from './Pages/Home'
import {Toaster} from "react-hot-toast"

function App() {
  

  return (
    <  >
     <div>
      <Toaster 
      position='top-right'
      toastOptions={
        {
          success:{
            theme:{
              primary:'#4aed88',
            }
          }
        }
      }
      >

      </Toaster>
     </div>
     <div className=' bg-[#1c1e29]   h-screen' >
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<Home/>}></Route>
     <Route path='/editor/:roomId' element={<EditorPage/>} ></Route>
     </Routes>
     </BrowserRouter>
     </div>
    </>
  )
}

export default App
