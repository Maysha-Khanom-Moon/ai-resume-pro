// app/auth/signin/page.tsx

'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Importing button component for consistent styling
import { Loader2 } from "lucide-react"; // For loading animation

const SignInPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider);
    } catch (error) {
      console.error("Error during sign-in", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign In</h1>

        <div className="space-y-4">
          <Button
            onClick={() => handleSignIn("github")}
            className="w-full bg-gray-800 text-white hover:bg-gray-900"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              "Sign in with GitHub"
            )}
          </Button>
          
          <Button
            onClick={() => handleSignIn("google")}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
