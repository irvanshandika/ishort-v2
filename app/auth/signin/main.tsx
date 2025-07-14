/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/src/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const signInSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const checkUserExists = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSubmit = async (data: SignInFormData) => {
    const loadingToast = toast.loading("Sedang memproses...");
    try {
      const userExists = await checkUserExists(data.email);

      if (!userExists) {
        toast.dismiss(loadingToast);
        toast.error(`Maaf, akun ${data.email} belum terdaftar.`);
        return;
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);

      toast.dismiss(loadingToast);
      const user = auth.currentUser;
      toast.success(`Selamat Datang Kembali, ${user?.displayName || data.email}!`);
      router.push("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);

      if (error.code === "auth/wrong-password") {
        toast.error("Password yang Anda masukkan salah");
      } else if (error.code === "auth/user-not-found") {
        toast.error("Email tidak ditemukan");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Terlalu banyak percobaan. Silakan coba lagi nanti");
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi");
      }
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    const loadingToast = toast.loading("Sedang memproses...");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userExists = await checkUserExists(result.user.email!);

      if (!userExists) {
        await auth.signOut();
        toast.dismiss(loadingToast);
        toast.error(`Maaf, akun ${result.user.email} belum terdaftar.`);
        return;
      }

      toast.dismiss(loadingToast);
      toast.success(`Selamat Datang Kembali, ${result.user.displayName}!`);
      router.push("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Proses login dibatalkan");
      } else {
        toast.error("Terjadi kesalahan saat login dengan Google");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex">
        {" "}
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-700 relative items-center justify-center p-12">
          {/* Login Security Illustration */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="https://cdni.iconscout.com/illustration/premium/thumb/login-security-illustration-download-in-svg-png-gif-file-formats--protection-password-nallow-set-04-pack-design-development-illustrations-7169452.png?f=webp"
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
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Sign in</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Welcome to logistics supply chain platform.
                <br />
                Login as a member to experience.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                <input
                  type="email"
                  placeholder="yatingzang@15@gmail.com"
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                    {...register("password")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    terms of service
                  </Link>
                </label>
              </div>{" "}
              {/* Sign In Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-base">
                {isSubmitting ? "Signing in..." : "Login Account"}
              </Button>
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-14 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 text-base">
                <FcGoogle size={20} className="mr-3" />
                Sign in with Google
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already a member?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
