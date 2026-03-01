import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import { useAppContext } from "../context/authContext";
import logoAura from "../assets/logo-aura.svg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("Please fill in all fields");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", formData);
      
      localStorage.setItem("aura_user_exists", "true");
      
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-white pb-20 px-6 font-poppins min-h-screen"
      style={{
        background: "linear-gradient(180deg, #FF7A18 0%, #E10600 40%, #E10600 80%, #FF4DA6 100%)",
      }}
    >
      <div onClick={() => navigate("/")} className="flex items-center mb-3 mt-8 cursor-pointer transition-transform hover:scale-105">
        <img src={logoAura} alt="Aura AI" className="h-10 w-auto min-w-[60px]" />
      </div>

      <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-sm mb-8 text-center text-white/80">Sign in to continue to AuraAI</p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70 ml-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={onChangeHandler} 
              placeholder="you@example.com" 
              required
              className="bg-white/10 border border-white/10 outline-none rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:bg-white/20 focus:border-white/40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/70 ml-1">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={onChangeHandler} 
              placeholder="••••••••" 
              required
              className="bg-white/10 border border-white/10 outline-none rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 transition-all focus:bg-white/20 focus:border-white/40"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <p className="text-center text-sm font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold underline hover:text-white/80 transition-colors">Sign up for free</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;