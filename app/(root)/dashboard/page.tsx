// app/dashboard/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const isAdmin = session.user?.role?.includes("admin")

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {isAdmin && (
            <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
              ADMIN
            </span>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {session.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            
            <div>
              <h2 className="text-2xl font-semibold">Welcome, {session.user?.name}!</h2>
              <p className="text-gray-600">{session.user?.email}</p>
              {isAdmin && (
                <p className="text-purple-600 font-semibold mt-1">Administrator Account</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Role:</strong> {session.user?.role?.join(", ") || "user"}</p>
            {session.user?.image && (
              <p><strong>Profile Image:</strong> <span className="text-green-600">✓ Set</span></p>
            )}
          </div>
        </div>

        <div className="space-x-4">
          <Link 
            href="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Edit Profile
          </Link>
          
          {isAdmin && (
            <Link 
              href="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 inline-block"
            >
              Admin Panel
            </Link>
          )}
          
          <Link 
            href="/api/auth/signout"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 inline-block"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  )
}