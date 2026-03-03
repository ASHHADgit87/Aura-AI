import React, { useState, Suspense, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import { useAppContext } from "../context/authContext";
import logoAura from "../assets/logo-aura.svg";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
        color: ["#FF7A18", "#E10600", "#FF4DA6"][Math.floor(Math.random() * 3)],
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

const DeletePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and all data.",
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const { data } = await api.delete("/api/user/delete-account");

      if (data.success) {
        toast.success("Account deleted successfully.");

        navigate("/", { replace: true });

        setTimeout(() => {
          localStorage.removeItem("aura_user_exists");
          deleteAccountCleanup();
        }, 0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white font-poppins">
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[15, 15, 15]} intensity={2} color="#ffffff" />
          <Suspense fallback={null}>
            <BubbleField count={500} />
          </Suspense>
        </Canvas>
      </div>

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

        <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-center">Settings</h1>
          <p className="text-sm mb-8 text-center text-white/60">
            Manage your Aura AI account
          </p>

          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">
                  Username
                </label>
                <p className="text-sm font-bold">{user?.name}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">
                  Email Address
                </label>
                <p className="text-sm font-bold">{user?.email}</p>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full my-2" />

            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <ShieldAlert className="text-red-500 shrink-0" size={20} />
              <p className="text-[11px] text-red-200/70 leading-relaxed">
                Deleting your account will remove all your data from our
                database. This action is irreversible.
              </p>
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600/80 hover:bg-red-600 border border-red-400/30 hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Trash2 size={18} /> Delete My Account
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="text-white/40 hover:text-white text-xs font-bold transition-colors text-center"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeletePage;
