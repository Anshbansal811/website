import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { UserRole } from "../../types/auth";

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "" as UserRole | "",
    company: "",
    phonenumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" && value !== "" ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      if (formData.role === "") {
        setError("Please select a role.");
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(formData.phonenumber)) {
        setError("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
      }

      await signup({ ...formData, role: formData.role as UserRole });
      setSuccess(true);
      // Show success message and redirect after a short delay
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Signup successful! Please login with your credentials.",
          },
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-row-1 md:grid-row-2 gap-6">
                <label>
                  <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                    Full Name
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </label>

                <label>
                  <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                    Email address
                  </div>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </label>

                <label>
                  <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                    Mobile Number
                  </div>
                  <input
                    name="phonenumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phonenumber}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </label>

                <label>
                  <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                    Password
                  </div>
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter password"
                  />
                </label>

                <label className="block">
                  <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                    Role
                  </div>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      <option value={UserRole.RETAILER}>Retailer</option>
                      <option value={UserRole.CORPORATE}>Corporate</option>
                      <option value={UserRole.SELLER}>Seller</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.66a.75.75 0 01-1.08 0l-4.25-4.66a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </label>

                {(formData.role === UserRole.CORPORATE ||
                  formData.role === UserRole.SELLER) && (
                  <label>
                    <div className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] ...">
                      Company Name
                    </div>
                    <input
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter company name"
                    />
                  </label>
                )}

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Signup successful! Redirecting to login...
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading
                      ? "Signing up..."
                      : success
                      ? "Success!"
                      : "Sign up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
