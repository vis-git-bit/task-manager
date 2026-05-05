import { useNavigate, Link } from 'react-router-dom';
import { Chrome, Facebook, Github, ArrowRight, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { useFormik } from "formik";   // ADDED
import * as Yup from "yup";           // ADDED

const Login = () => {
    const navigate = useNavigate();

    // Formik setup (ADDED)
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
            password: Yup.string()
                .min(4, "Min 4 characters")
                .required("Password is required")
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch('https://69ef23b6112e1b968e240e58.mockapi.io/users'); // fetch all users data from API
                const data = await response.json(); // convert response into JSON format

                const users = data.find(  // find user whose email & password match input
                    (u) => u.email === values.email && u.password === values.password  // check if entered email & password match any user
                );

                if (users) {  //if matches
                    console.log("login successfull")
                    localStorage.setItem("user", JSON.stringify(users));  //save the users under "user" key
                    navigate("/home")  //navigate to home page
                } else {     //if not matches
                    console.log("login failed")  //error
                }
            }
            catch (error) {
                console.log("Error:", error);// handle API or network errors
            }
        }
    });

    return (
        // bg div
      <div className="min-h-screen bg-linear-to-br from-[#E0D7FF] via-[#F3EFFF] to-[#E9E2FF] flex items-center justify-center p-6 font-sans relative overflow-hidden">
     <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#C7B5FB] rounded-full blur-[140px] opacity-30"></div>
    <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#B4A1CC] rounded-full blur-[140px] opacity-25"></div>

            <div className="animate-[fadeInUp_1.0s_ease-out] flex w-full max-w-5xl h-175 bg-white/70 backdrop-blur-xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(124,58,237,0.1)] overflow-hidden border border-white relative z-10">
                
                {/* LEFT SIDE - Illustration Panel */}
                <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#F8F7FF] to-[#E9E2FF] p-16 flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center gap-3 z-10">
                        <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <CheckCircle2 className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-bold text-[#2E1065] tracking-tight">Task-Manager</span>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-5xl font-extrabold leading-tight text-[#1E1B4B] mb-6">
                            Organize work <br /> 
                            <span className="text-[#7C3AED]">life, better.</span>
                        </h1>
                        <div className="relative inline-block">
                             <img src="/work.svg" alt="Work" className="w-full max-h-72 object-contain drop-shadow-2xl" />
                             <div className="absolute -right-4 top-0 bg-white/80 backdrop-blur-md shadow-xl p-3 px-5 rounded-2xl border border-purple-50 flex items-center gap-3 ">
                                <Zap size={16} className="text-[#7C3AED]"/>
                                <span className="text-xs font-bold text-[#2E1065]">Instant Sync</span>
                             </div>
                        </div>
                    </div>
                    
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.4em] z-10">2026 Build</span>
                </div>

                {/* RIGHT SIDE - Form Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-12 bg-white/40">
                    <div className="w-full max-w-sm">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-4xl font-bold text-[#1E1B4B] mb-2">Login</h2>
                            <p className="text-[#64748B] text-sm">Welcome back! Please enter your details.</p>
                        </div>

                        {/* FORM (ADDED) */}
                        <form onSubmit={formik.handleSubmit} className="space-y-6">

                            <div className="group">
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest block mb-2 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"   // ADDED (Formik needs name)
                                    placeholder="name@company.com" 
                                    value={formik.values.email} //  display email state in input
                                    onChange={formik.handleChange} //update state whenevr value changes
                                    onBlur={formik.handleBlur}     // ADDED
                                    className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-4 px-6 outline-none transition-all focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-50 group-hover:border-purple-200" 
                                />
                                {/* ERROR MESSAGE */}
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs">{formik.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-[#475569] uppercase tracking-widest block mb-2 ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"  // ADDED
                                    placeholder="••••••••" 
                                    value={formik.values.password} // display password state in input
                                    onChange={formik.handleChange} //update state whenever value changes
                                    onBlur={formik.handleBlur}     // ADDED
                                    className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-4 px-6 outline-none transition-all focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-50" 
                                />
                                {/* ERROR MESSAGE */}
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-xs">{formik.errors.password}</p>
                                )}
                            </div>

                            <button 
                                type="submit"  // ADDED
                                disabled={!formik.isValid} // stop submit if error
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
                            >
                                  Log In 
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="mt-10 mb-8 flex items-center">
                            <div className="grow border-t border-[#F1F5F9]"></div>
                            <span className="mx-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Social Login</span>
                            <div className="grow border-t border-[#F1F5F9]"></div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Chrome size={20} /></button>
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Facebook size={20} /></button>
                            <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl flex justify-center text-[#64748B] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors hover:bg-purple-50"><Github size={20} /></button>
                        </div>

                        <p className="mt-10 text-center text-sm text-[#64748B]">
                            Don't have an account <Link to="/signup" className="text-[#7C3AED] font-bold hover:underline ml-1">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Login;