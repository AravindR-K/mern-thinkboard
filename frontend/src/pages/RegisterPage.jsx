import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form className="card bg-base-100 p-6 w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="input input-bordered mb-3"
          onChange={handleChange}
        />
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

        <button className="btn btn-primary w-full">Register</button>

        <p className="text-sm mt-3 text-center">
          Already have an account? <Link to="/login" className="link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
