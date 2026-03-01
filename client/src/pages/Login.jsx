import React, { useState, Suspense, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import { useAppContext } from "../context/authContext";
import logoAura from "../assets/logo-aura.svg";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ========================= */
/*  Bubble Background Field  */
/* ========================= */

const BubbleField = ({ count = 500 }) => {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.02 + Math.random() * 0.05,
        x: (Math.random() - 0.5) * 40,
        yStart: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 20,
        size: 0.05 + Math.random() * 0.15,
        color: ["#FF7A18", "#E10600", "#FF4DA6"][
          Math.floor(Math.random() * 3)
        ],
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      particle.t += particle.speed;

      const yPos = ((particle.t + particle.yStart) % 40) - 20;
      const xOscillation = Math.sin(particle.t * 0.5) * 0.5;

      dummy.position.set(particle.x + xOscillation, yPos, particle.z);
      dummy.scale.set(particle.size, particle.size, particle.size);
      dummy.updateMatrix();

      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, new THREE.Color(particle.color));
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        roughness={0}
        metalness={0.8}
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

/* ========================= */
/*          Login Page       */
/* ========================= */

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return toast.error("Please fill in all fields");

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
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white font-poppins">
      
      {/* Bubble Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[15, 15, 15]} intensity={2} color="#ffffff" />
          <Suspense fallback={null}>
            <BubbleField count={500} />
          </Suspense>
        </Canvas>
      </div>

      {/* Original Content (UNCHANGED) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white pb-20 px-6 min-h-screen">
        
        <div
          onClick={() => navigate("/")}
          className="flex items-center mb-3 mt-8 cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src={logoAura}
            alt="Aura AI"
            className="h-10 w-auto min-w-[60px]"
          />
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Welcome back
          </h1>
          <p className="text-sm mb-8 text-center text-white/80">
            Sign in to continue to AuraAI
          </p>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70 ml-1">
                Email
              </label>
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
              <label className="text-xs font-bold uppercase tracking-widest text-white/70 ml-1">
                Password
              </label>
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
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">
              or
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <p className="text-center text-sm font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold underline hover:text-white/80 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
};

export default Login;