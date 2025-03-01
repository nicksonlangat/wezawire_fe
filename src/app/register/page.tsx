"use client";
import { useState } from "react";
import { useApi } from "../http/api";

import { toast } from "sonner";
import Link from "next/link";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [processing, setProcessing] = useState(false);
  const { createUser } = useApi();
  const router = useRouter();
  // Form state
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate passwords match
    if (registerData.password !== registerData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    setProcessing(true);
    try {
      // Remove confirm_password before sending to API
      const { confirm_password, ...dataToSubmit } = registerData;
      const response = await createUser(dataToSubmit);
      setProcessing(false);
      toast.success("Registration successful! Please log in.");
      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      // You might also want to store user data if it's returned
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      router.push("/");
    } catch (error) {
      setProcessing(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-12 text-violet-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.7134 7.12811L4.46682 7.69379C4.28637 8.10792 3.71357 8.10792 3.53312 7.69379L3.28656 7.12811C2.84706 6.11947 2.05545 5.31641 1.06767 4.87708L0.308047 4.53922C-0.102682 4.35653 -0.102682 3.75881 0.308047 3.57612L1.0252 3.25714C2.03838 2.80651 2.84417 1.97373 3.27612 0.930828L3.52932 0.319534C3.70578 -0.106511 4.29417 -0.106511 4.47063 0.319534L4.72382 0.930828C5.15577 1.97373 5.96158 2.80651 6.9748 3.25714L7.69188 3.57612C8.10271 3.75881 8.10271 4.35653 7.69188 4.53922L6.93228 4.87708C5.94451 5.31641 5.15288 6.11947 4.7134 7.12811ZM3.06361 21.6132C4.08854 15.422 6.31105 1.99658 21 1.99658C19.5042 4.99658 18.5 6.49658 17.5 7.49658L16.5 8.49658L18 9.49658C17 12.4966 14 15.9966 10 16.4966C7.33146 16.8301 5.66421 18.6635 4.99824 21.9966H3C3.02074 21.8722 3.0419 21.7443 3.06361 21.6132Z"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-violet-500 hover:text-violet-600"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 text-gray-500 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* First Name Field */}
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="given-name"
                required
                value={registerData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                required
                value={registerData.last_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={registerData.email}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={registerData.password}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                value={registerData.confirm_password}
                onChange={handleInputChange}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-violet-500 focus:ring-violet-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{" "}
              <a
                href="#"
                className="font-medium text-violet-500 hover:text-violet-600"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-violet-500 hover:text-violet-600"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className="group relative w-full 
              flex justify-center py-2 px-4 border border-transparent
               text-sm font-medium rounded-lg text-white bg-violet-500
                hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 transition-all duration-300"
            >
              {processing ? (
                <>
                  <Spinner className="mr-2 text-violet-600" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
