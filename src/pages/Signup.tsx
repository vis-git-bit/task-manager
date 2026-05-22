import React, { useState } from 'react'; // Added for password toggle
import { useNavigate, Link } from "react-router-dom";
import { Chrome, Facebook, Github, ArrowRight, ShieldCheck, Mail, Lock, Sparkles, Eye, EyeOff, User } from 'lucide-react';
import { useFormik } from "formik";   
import * as Yup from "yup";   
import { useAuth } from "../context/AuthContext";      

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    // Formik setup 
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(4, "Min 4 characters").required("Password is required")
        }),
        onSubmit: async (values) => {

            const newUser = {  // object containing new user details
                name: values.name,
                role: "user",
                email: values.email,
                password: values.password
            }

            try {
                //  Save to MockAPI
                const res = await fetch('https://69ef23b6112e1b968e240e58.mockapi.io/users', {  // send POST request to API to create new user
                    method: "POST",  // HTTP method to create data
                    headers: {   // tell server we are sending JSON data
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newUser)  // convert JS object into JSON string for API
                });

                const data = await res.json();  // convert API response into JSON

                login(data, "user", "fake-token-" + Date.now());

                //  Navigate to home
                navigate("/home");

            } catch (error) {
                console.log("Signup error:", error);
            }
        }
    });

    return (
        <div className="min-h-screen bg-linear-to-br from-[#D8CCFF] via-[#F3EFFF] to-[#E9E2FF] flex items-center justify-center p-6 font-sans relative overflow-hidden">
    
            {/* Enhanced Background Blobs for more Purple presence */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#C7B5FB] rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-[#B4A1CC] rounded-full blur-[120px] opacity-35"></div>

            <div className="animate-[fadeIn_1.0s_ease-out] flex w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(124,58,237,0.12)] overflow-hidden border border-white relative z-10">

              {/* left SIDE - Illustration Panel */}
                <div className="hidden lg:flex w-1/2 bg-linear-to-bl from-[#F8F7FF] to-[#F3E8FF] p-16 flex-col justify-between border-r border-purple-50 relative overflow-hidden">
                    <div className="flex items-center gap-3 z-10">
                        <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <ShieldCheck className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-bold text-[#2E1065] tracking-tight">Task-Manager</span>
                    </div>
                    
                    <div className="z-10">
                        <h1 className="text-5xl font-extrabold leading-tight text-[#1E1B4B]">
                            Create your <br /> <span className="text-[#7C3AED]">account.</span>
                        </h1>
                        <p className="text-[#64748B] mt-4 font-medium text-sm">Join teams organizing work with speed.</p>
                        
                        <div className="relative mt-8">
                             <img src="/signup.svg" alt="Sign Up" className="w-[85%] max-h-72 object-contain drop-shadow-2xl" />
                             <div className="absolute -left-4 bottom-10 bg-white shadow-lg p-3 px-5 rounded-2xl border border-purple-100 flex items-center gap-3">
                                <Sparkles size={16} className="text-[#7C3AED] fill-[#7C3AED]"/>
                                <span className="text-xs font-bold text-[#2E1065]">Free Tier</span>
                             </div>
                        </div>
                    </div>
                    
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.4em] z-10">Enterprise Suite - 2026</span>
                </div>

                {/* Right SIDE - Form Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12 bg-white/40">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-[#1E1B4B] mb-2">Sign Up</h2>
                            <p className="text-[#64748B] text-sm italic">Join the future of productivity.</p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={formik.handleSubmit} className="space-y-4">

                            <div className="group">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest block mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        name="name"  
                                        placeholder="Enter your name" 
                                        value={formik.values.name}  // display name state in input
                                        onChange={formik.handleChange}  // update name state when user types
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#FBFBFF] border border-[#E2E8F0] rounded-2xl py-4 pl-12 pr-6 outline-none transition-all focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-purple-100" 
                                    />
                                </div>
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.name}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest block mb-2 ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                                    <input 
                                        type="email"
                                        name="email" 
                                        placeholder="name@company.com" 
                                        value={formik.values.email} // display email state in input
                                        onChange={formik.handleChange}  // update email state when user types
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#FBFBFF] border border-[#E2E8F0] rounded-2xl py-4 pl-12 pr-6 outline-none transition-all focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-purple-100" 
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.email}</p>
                                )}
                            </div>

                            <div className="group">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest block mb-2 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••" 
                                        value={formik.values.password} // display password state in input
                                        onChange={(e) => formik.handleChange(e)}  // update password state when user types
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#FBFBFF] border border-[#E2E8F0] rounded-2xl py-4 pl-12 pr-14 outline-none transition-all focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-purple-100" 
                                    />
                                    {/* Password Toggle */}
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#7C3AED] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.password}</p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={!formik.isValid} // stop submit if error
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-purple-100 mt-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                Get Started <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="mt-8 mb-6 flex items-center">
                            <div className="grow border-t border-[#F1F5F9]"></div>
                            <span className="mx-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Or Register With</span>
                            <div className="grow border-t border-[#F1F5F9]"></div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Chrome size={20} /></button>
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Facebook size={20} /></button>
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Github size={20} /></button>
                        </div>

                        <p className="mt-8 text-center text-sm text-[#64748B]">
                            Already have an account? <Link to="/" className="text-[#7C3AED] font-bold hover:underline ml-1">Login</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default SignUp;