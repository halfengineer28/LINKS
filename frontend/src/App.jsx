import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/auth/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import SideBar from "./components/common/SideBar";
import RightPannel from "./components/common/RightPannel";
import Notification from "./pages/auth/notification/Notification";
import ProfilePage from "./pages/profile/ProfilePage"

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <SideBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<Notification />}></Route>
        <Route path="/profile/:user" element={<ProfilePage />}></Route>
      </Routes>
     <RightPannel />
    </div>
  );
}

export default App;
