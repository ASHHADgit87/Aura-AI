import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import { useAppContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles changes to form data fields.
 * Updates the formData state with the new value.
 * @param {React.ChangeEvent<HTMLFormElement>} e - The change event.
 */
/*******  becfcf55-0d96-42a8-b761-6e9741f5154f  *******/  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("Please fill in all fields");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", formData);
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
      className="flex flex-col items-center justify-center text-white text-sm px-4 min-h-screen font-poppins"
      style={{ background: `linear-gradient(180deg, #0d0d1a 0%, #1a0533 50%, #0d0d1a 100%)` }}
    >
      <div onClick={() => navigate("/")} className="flex items-center gap-2 mb-8 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">A</div>
        <span className="text-lg font-bold tracking-tight">Aura<span className="text-violet-400">AI</span></span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-white/40 text-xs mb-6">Sign in to continue to AuraAI</p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
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
          <button type="submit" disabled={loading}
            className="mt-2 w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <><span>Signing in</span><Loader2 className="animate-spin w-4 h-4" /></> : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-center text-white/40 text-xs">
          Don't have an account?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">Sign up for free</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;