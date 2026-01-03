// app/profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  User, Mail, MapPin, Briefcase, GraduationCap, 
  Award, Calendar, Facebook, Github, Linkedin, 
  Edit, Save, X, Trash2, Plus 
} from "lucide-react"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Footer from "@/components/Footer"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    currentJob: "",
    education: "",
    experience: "",
    skills: [] as string[],
    fbLink: "",
    githubLink: "",
    linkedinLink: ""
  })
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user?.id) {
      fetchUser()
    }
  }, [session, status])

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`)
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          location: data.user.location || "",
          currentJob: data.user.currentJob || "",
          education: data.user.education || "",
          experience: data.user.experience || "",
          skills: data.user.skills || [],
          fbLink: data.user.fbLink || "",
          githubLink: data.user.githubLink || "",
          linkedinLink: data.user.linkedinLink || ""
        })
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setEditing(false)
        
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.user.name
          }
        })
        
        alert("Profile updated successfully!")
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update profile")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }
    
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        alert("Account deleted successfully")
        router.push("/api/auth/signout")
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete account")
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, skillInput.trim()] 
      })
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  if (status === "loading" || loading) {
    return (
      
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )
    }

    if (!session || !user) {
      return null
    }

    const isAdmin = session?.user?.role?.includes("admin")
    const canDeleteAccount = user.email !== "maysha412@gmail.com"

    return (
    <>
      <DashboardNavbar user={user} />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100 dark:border-slate-700">
            <div className="relative h-32 sm:h-40 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
                {user.imageLink ? (
                  <img 
                    src={user.imageLink} 
                    alt={user.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-16 sm:pt-20 px-4 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.name}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 break-all">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.role.map((role: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold capitalize">
                        {role}
                      </span>
                    ))}
                    {isAdmin && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="p-6 sm:p-8">
              {!editing ? (
                <div className="space-y-6">
                  {/* Bio Section */}
                  {user.bio && (
                    <div className="pb-6 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                    {user.location && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Location</p>
                          <p className="text-gray-900 dark:text-white font-medium">{user.location}</p>
                        </div>
                      </div>
                    )}

                    {user.currentJob && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                          <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Current Position</p>
                          <p className="text-gray-900 dark:text-white font-medium wrap-break-words">{user.currentJob}</p>
                        </div>
                      </div>
                    )}

                    {user.education && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Education</p>
                          <p className="text-gray-900 dark:text-white font-medium wrap-break-words">{user.education}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  {user.experience && (
                    <div className="pb-6 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {user.experience}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="pb-6 border-b border-gray-200 dark:border-slate-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {(user.fbLink || user.githubLink || user.linkedinLink) && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h2>
                      <div className="flex flex-wrap gap-3">
                        {user.linkedinLink && (
                          <a
                            href={user.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span className="font-medium">LinkedIn</span>
                          </a>
                        )}
                        {user.githubLink && (
                          <a
                            href={user.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Github className="w-5 h-5" />
                            <span className="font-medium">GitHub</span>
                          </a>
                        )}
                        {user.fbLink && (
                          <a
                            href={user.fbLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Facebook className="w-5 h-5" />
                            <span className="font-medium">Facebook</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delete Account */}
                  {canDeleteAccount && (
                    <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Email (disabled) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Two column layout for desktop */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        placeholder="e.g., New York, USA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Current Job
                      </label>
                      <input
                        type="text"
                        value={formData.currentJob}
                        onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        placeholder="e.g., Software Engineer at Google"
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                      placeholder="e.g., BS in Computer Science, MIT"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white resize-none"
                      rows={4}
                      placeholder="Describe your work experience..."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Skills
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                        placeholder="Add a skill and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={formData.linkedinLink}
                          onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={formData.githubLink}
                          onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={formData.fbLink}
                          onChange={(e) => setFormData({ ...formData, fbLink: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                          placeholder="https://facebook.com/yourprofile"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          name: user.name || "",
                          bio: user.bio || "",
                          location: user.location || "",
                          currentJob: user.currentJob || "",
                          education: user.education || "",
                          experience: user.experience || "",
                          skills: user.skills || [],
                          fbLink: user.fbLink || "",
                          githubLink: user.githubLink || "",
                          linkedinLink: user.linkedinLink || ""
                        })
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}