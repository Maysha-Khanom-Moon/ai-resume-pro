// components/Navbar.tsx

'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Reuse button component
import { Menu, X } from "lucide-react"; // For the mobile menu icon
import Link from "next/link"; // For navigation links

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white">
            {/* Logo Icon (SVG or text) */}
            <span className="text-xl">📄</span>
          </div>
          <span className="text-2xl font-semibold">ResumeAI</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/about" className="hover:text-teal-400">About</Link>
          <Link href="/pricing" className="hover:text-teal-400">Pricing</Link>
          <Link href="/contact" className="hover:text-teal-400">Contact</Link>

          {/* Sign In Button */}
          <Button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg text-xl">
            Sign In
          </Button>

          {/* Get Started Button */}
          <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white py-2 px-6 rounded-lg text-xl">
            Get Started
          </Button>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center">
          <Button onClick={handleToggleMenu} className="text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700 px-6 py-4 space-y-4">
          <Link href="/about" className="text-white block hover:text-teal-400">About</Link>
          <Link href="/pricing" className="text-white block hover:text-teal-400">Pricing</Link>
          <Link href="/contact" className="text-white block hover:text-teal-400">Contact</Link>

          {/* Sign In and Get Started Buttons */}
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-lg text-xl">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white py-2 px-6 rounded-lg text-xl">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
