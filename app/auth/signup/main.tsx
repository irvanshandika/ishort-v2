/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const route = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0"); // Hari (2 digit)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan (2 digit, Januari = 0)
    const year = date.getFullYear(); // Tahun (4 digit)
    return `${day}-${month}-${year}`; // Format DD-MM-YYYY
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCredentialSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const createdAtFormatted = formatDate(new Date());

      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&background=random`,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: formData.displayName,
        email: formData.email,
        signType: "credential",
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&background=random`,
        role: "user",
        plan: "free",
        status: "active",
        createdAt: createdAtFormatted,
      });

      toast.success("Account created successfully");
      route.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const createdAtFormatted = formatDate(new Date());
      const result = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        signType: "google",
        photoUrl: result.user.photoURL,
        role: "user",
        plan: "free",
        status: "active",
        createdAt: createdAtFormatted,
      });

      toast.success(`Welcome ${result.user.displayName}`);
      route.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-700 relative items-center justify-center p-12">
          {/* Login Security Illustration */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="https://cdni.iconscout.com/illustration/premium/thumb/social-media-signup-illustration-download-in-svg-png-gif-file-formats--user-registration-interface-account-sign-up-login-or-pack-illustrations-3723266.png?f=webp"
              alt="Login Security Illustration"
              width={0}
              height={0}
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-sm">
            {/* Title */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Sign up</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Welcome to logistics supply chain platform.
                <br />
                Register as a member to experience.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCredentialSignUp} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••"
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••••"
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    terms of service
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button type="submit" disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-base">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Google Sign Up Button */}
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                variant="outline"
                disabled={loading}
                className="w-full h-14 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 text-base">
                <FcGoogle size={20} className="mr-3" />
                Sign up with Google
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
