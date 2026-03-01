import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import { useAppContext } from "../context/authContext";
import logoAura from "../assets/logo-aura.svg";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) return toast.error("Please fill in all fields");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", { name: formData.name, email: formData.email, password: formData.password });
      
      localStorage.setItem("aura_user_exists", "true");
      
      if(data.token && data.user) {
          login(data.token, data.user);
      }

      toast.success("Account created successfully!");
      navigate("/image-analyzer");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
    { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
    { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" },
  ];

  return (
    <section
      className="flex flex-col items-center justify-center text-white pb-20 px-6 font-poppins min-h-screen"
      style={{
        background: "linear-gradient(180deg, #FF7A18 0%, #E10600 40%, #E10600 80%, #FF4DA6 100%)",
      }}
    >
      <div onClick={() => navigate("/")} className="flex items-center mb-3 mt-8 cursor-pointer group">
        <img src={logoAura} alt="Aura AI" className="h-10 w-auto transition-transform group-hover:scale-110" />
      </div>

      <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500 via-red-600 to-pink-500 opacity-5 pointer-events-none"></div>
        
        <h1 className="text-3xl font-bold mb-2 text-center">Create account</h1>
        <p className="text-sm mb-6 text-center text-white/70">Join AuraAI — completely free, no pricing</p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 relative z-10">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 ml-1">{field.label}</label>
              <input
                type={field.type} 
                name={field.name} 
                value={formData[field.name]}
                onChange={onChangeHandler} 
                placeholder={field.placeholder} 
                required
                className="bg-white/10 border border-white/10 outline-none rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:bg-white/20 focus:border-white/40"
              />
            </div>
          ))}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 px-10 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <><Loader2 className="animate-spin w-5 h-5" /> <span>Creating...</span></> : "Get Started for Free →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-[10px] font-bold uppercase">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold underline hover:text-orange-200 transition-colors">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;