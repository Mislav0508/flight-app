import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Error from './Components/Error'
import "./App.css"
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom"



const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App
