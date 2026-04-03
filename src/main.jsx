import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Authprovider } from './Component/Auth.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
  <Authprovider>
  <App/>
  </Authprovider>
  </BrowserRouter>
)
