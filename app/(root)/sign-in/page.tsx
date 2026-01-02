'use client'
import { signIn } from "next-auth/react";
import { FC } from "react";

const SignInPage: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Sign In</h2>
        <p className="text-center text-gray-500 dark:text-gray-400">Sign in to access your account</p>

        {/* Google Sign-In Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In with Google
        </button>

        {/* GitHub Sign-In Button */}
        <button
          onClick={() => signIn("github")}
          className="w-full p-3 mt-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition-colors"
        >
          Sign In with GitHub
        </button>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Email and Password Form (Optional) */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            className="w-full mt-4 p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
