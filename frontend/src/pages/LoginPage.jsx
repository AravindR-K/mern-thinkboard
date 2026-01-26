import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", form);

    toast.success("OTP sent to your email");

    navigate("/verify-otp", {
      state: { userId: res.data.userId },
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid credentials");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form className="card bg-base-100 p-6 w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered mb-3"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered mb-4"
          onChange={handleChange}
        />

        <button className="btn btn-primary w-full">Login</button>

        <p className="text-sm mt-3 text-center">
          No account? <Link to="/register" className="link">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
