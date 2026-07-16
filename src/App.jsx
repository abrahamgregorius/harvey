import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const routes = [
  {
    path: "/",
    element: <Home></Home>
  },
  // ...
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {routes.map((route) => {
          return (
            <Route path={route.path} element={route.element}></Route>
          )
        })}
      </Routes>
    </>
  )
}

export default App
