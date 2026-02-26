import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) return toast.error("Please fill in all fields");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      setLoading(true);
      await axios.post("/api/auth/register", { name: formData.name, email: formData.email, password: formData.password });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-white text-sm px-4 min-h-screen font-poppins"
      style={{ background: `linear-gradient(180deg, #0d0d1a 0%, #1a0533 50%, #0d0d1a 100%)` }}
    >
      <div onClick={() => navigate("/")} className="flex items-center gap-2 mb-8 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">A</div>
        <span className="text-lg font-bold tracking-tight">Aura<span className="text-violet-400">AI</span></span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Create an account</h1>
        <p className="text-white/40 text-xs mb-6">Join AuraAI and access 8 free AI tools</p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChangeHandler} placeholder="John Doe"
              className="bg-white/5 border border-white/10 focus:border-violet-500/60 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Email</label>
            <input type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="you@example.com"
              className="bg-white/5 border border-white/10 focus:border-violet-500/60 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChangeHandler} placeholder="••••••••"
              className="bg-white/5 border border-white/10 focus:border-violet-500/60 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChangeHandler} placeholder="••••••••"
              className="bg-white/5 border border-white/10 focus:border-violet-500/60 outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors" required />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <><span>Creating account</span><Loader2 className="animate-spin w-4 h-4" /></> : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-center text-white/40 text-xs">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;