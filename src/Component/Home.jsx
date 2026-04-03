import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import "./Style/Home.css";

// === 1. THREE.JS BACKGROUND COMPONENTS ===
const StarField = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Violet glow
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const FloatingShape = ({ position, color }) => {
  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={color} wireframe opacity={0.3} transparent />
      </mesh>
    </Float>
  );
};

const BackgroundCanvas = () => {
  return (
    <div className="three-bg">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <StarField />
        <FloatingShape position={[-1, 0.5, 0]} color="#06b6d4" /> {/* Cyan Shape */}
        <FloatingShape position={[1, -0.5, 0]} color="#ec4899" /> {/* Pink Shape */}
      </Canvas>
    </div>
  );
};

// === 2. TILT CARD COMPONENT ===
const TiltCard = ({ children }) => {
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate calculation
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      className="tilt-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.1s ease-out" }}
    >
      {children}
    </div>
  );
};

// === 3. MAIN HOME COMPONENT ===
const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://apptitute-backend.onrender.com/api/user/saveUser", form);
      alert("User Created Successfully");
      setShowModal(false);
      navigate("/login");
    } catch (error) {
      alert("Error: User might already exist.");
    }
  };

  return (
    <div className="home-container">
      
      {/* ✅ Three.js Background */}
      <BackgroundCanvas />

      {/* === HERO SECTION === */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">🚀 New Batch Starting Soon</div>
          <h1 className="hero-title">
            Unlock Your <br />
            <span className="gradient-text">True Potential</span>
          </h1>
          <p className="hero-desc">
            Master Aptitude, Logical Reasoning, and Verbal Ability with our
            AI-driven adaptive learning platform. Prepare smarter, not harder.
          </p>
          
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Sign Up Free
            </button>
          </div>

          <div className="trust-badge">
            <p>Trusted by <strong>10,000+ Students</strong></p>
          </div>
        </div>

        {/* 3D FLOATING CSS ELEMENT (Same as before) */}
        <div className="hero-visual">
          <div className="floating-card">
            <div className="glow-circle"></div>
            <div className="glass-panel">
              <div className="chart-circle">
                <span className="percent">92%</span>
                <span className="label">Accuracy</span>
              </div>
              <div className="progress-bars">
                <div className="bar"><div className="fill" style={{width: '80%'}}></div></div>
                <div className="bar"><div className="fill" style={{width: '60%'}}></div></div>
                <div className="bar"><div className="fill" style={{width: '90%'}}></div></div>
              </div>
            </div>
            {/* Floating Icons */}
            <div className="float-icon icon-1">📚</div>
            <div className="float-icon icon-2">⚡</div>
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION (Simple Cards) === */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Apptitute?</h2>
        
        <div className="features-grid">
          
          <TiltCard>
            <div className="feature-card">
              <div className="icon-box color-1">🧩</div>
              <h3>Topic-wise Practice</h3>
              <p>Solve questions categorized by difficulty and topics like Quants, Logical, and Verbal.</p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="feature-card">
              <div className="icon-box color-2">📊</div>
              <h3>Performance Analytics</h3>
              <p>Get detailed graphical reports to identify your strong and weak areas instantly.</p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="feature-card">
              <div className="icon-box color-3">⏳</div>
              <h3>Mock Tests</h3>
              <p>Experience real exam scenarios with timer-based tests and negative marking.</p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="feature-card">
              <div className="icon-box color-4">🏆</div>
              <h3>Leaderboard</h3>
              <p>Compete with thousands of students and improve your all-India ranking.</p>
            </div>
          </TiltCard>

        </div>
      </section>

      {/* === STATISTICS SECTION === */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>500+</h2>
          <p>Mock Tests</p>
        </div>
        <div className="stat-box">
          <h2>50k+</h2>
          <p>Questions Solved</p>
        </div>
        <div className="stat-box">
          <h2>100%</h2>
          <p>Placement Support</p>
        </div>
      </section>

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-glass">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            <h2>Create Account</h2>
            <p>Join the community of toppers today.</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" name="name" required onChange={handleChange} placeholder="Full Name" />
              </div>
              <div className="input-group">
                <input type="email" name="email" required onChange={handleChange} placeholder="Email Address" />
              </div>
              <div className="input-group">
                <input type="password" name="password" required onChange={handleChange} placeholder="Password" />
              </div>
              <button type="submit" className="submit-btn">Register Now</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;