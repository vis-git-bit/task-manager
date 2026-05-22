import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast"; 
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
import ProtectedRoute from "./components/ProtectedRoute"; 
import PublicRoute from "./components/PublicRoute"; 

function App() {
  return (
      <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
         
          success: {
            className: 'font-bold text-sm border-2 border-[#6D28D9] rounded-2xl bg-white text-[#1E1B4B]',
            duration: 3000,
            iconTheme: {
              primary: '#6D28D9',
              secondary: '#fff',
            },
          },
          error: {
            className: 'font-bold text-sm border-2 border-red-500 rounded-2xl bg-white text-red-600',
          }
        }}
      />  
     <Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} /> 
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> 
      </Routes>
     </Suspense> 
  </>
  );
}

export default App;