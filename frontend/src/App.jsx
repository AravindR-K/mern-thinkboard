import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyOtpPage from "./pages/VerifyOtpPage";

const App = () => {
  return (
    <div className="relative h-full w-full">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute >}/>
        <Route path="/create" element={<ProtectedRoute> <CreatePage /> </ProtectedRoute >}/>
        <Route path="/note/:id" element={<ProtectedRoute> <NoteDetailPage /> </ProtectedRoute >}/>
      </Routes>
    </div>
  );
};

export default App;
