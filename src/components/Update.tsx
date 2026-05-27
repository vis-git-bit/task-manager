import { useState, useContext } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

type Props = {
  onClose: () => void;
  onPasswordUpdate: (newPassword: string) => void; 
};

const UpdatePasswordModal = ({ onClose, onPasswordUpdate }: Props) => {
  const { user, login } = useAuth();
  const { theme }: any = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Old password is required")
        .test(
          "match-old-password",
          "Old password is incorrect",
          (value) => value === user?.password
        ),

      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword")],
          "Passwords do not match"
        )
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedUser = {
          id: user?.id || "",
          name: user?.name || "",
          email: user?.email || "",
          password: values.newPassword,
          role: user?.role || "",
        };

        const response = await fetch(
          `https://69ef23b6112e1b968e240e58.mockapi.io/users/${user?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update password");
        }

        login(
          updatedUser,
          user?.role || "",
          localStorage.getItem("token") || ""
        );

        console.log("Password updated successfully");
        onPasswordUpdate(values.newPassword);
        onClose(); 

      } catch (error) {
        console.error(error);
        console.log("Failed to update password");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md rounded-4xl p-6 md:p-8 shadow-2xl border my-auto animate-[fadeInUp_0.3s_ease-out] ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-purple-100"
      }`}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-[#1E1B4B]"}`}>
              Update Password
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-[#94A3B8]"}`}>
              Keep your account secure with a strong password.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isDark ? "bg-slate-800 hover:bg-red-500/20" : "bg-purple-50 hover:bg-red-50"
            }`}
          >
            <X size={20} className={`${isDark ? "text-slate-400" : "text-[#7C3AED]"} hover:text-red-500`} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* OLD PASSWORD */}
          <div className="mb-4">
            <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              Old Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter old password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-14 rounded-2xl border outline-none transition-all text-sm font-medium pl-12 pr-12 ${
                  isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-[#7C3AED]" 
                  : "bg-purple-50/40 border-purple-100 text-[#1E1B4B] focus:border-[#7C3AED]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <p className="text-red-500 text-xs mt-2 font-medium">
                {formik.errors.oldPassword}
              </p>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-4">
            <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-14 rounded-2xl border outline-none transition-all text-sm font-medium pl-12 pr-12 ${
                  isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-[#7C3AED]" 
                  : "bg-purple-50/40 border-purple-100 text-[#1E1B4B] focus:border-[#7C3AED]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-xs mt-2 font-medium">
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-200" : "text-[#1E1B4B]"}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full h-14 rounded-2xl border outline-none transition-all text-sm font-medium pl-12 pr-12 ${
                  isDark 
                  ? "bg-slate-800 border-slate-700 text-white focus:border-[#7C3AED]" 
                  : "bg-purple-50/40 border-purple-100 text-[#1E1B4B] focus:border-[#7C3AED]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-2 font-medium">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full h-14 rounded-2xl text-white font-bold transition-all disabled:opacity-50 cursor-pointer ${
              isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-[#7C3AED] hover:bg-[#6D28D9]"
            }`}
          >
            {formik.isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UpdatePasswordModal;