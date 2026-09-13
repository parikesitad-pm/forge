import React, { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { settingsApi } from '@/services/api/settingsApi'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

export const SettingsView: React.FC = () => {
  const { user, refetchUser } = useAuth()
  const { toast } = useToast()

  const [fullname, setFullname] = useState(user?.fullname || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const [imgError, setImgError] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast('Image size exceeds 5MB limit.', 'error')
      return
    }

    setAvatarFile(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
    setImgError(false)
  }

  const handleRemoveAvatarPreview = () => {
    setAvatarFile(null)
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
      setAvatarPreview(null)
    }
    setImgError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      if (avatarFile) {
        const formData = new FormData()
        formData.append('user[fullname]', fullname)
        formData.append('user[username]', username)
        formData.append('user[bio]', bio)
        formData.append('user[avatar]', avatarFile)
        await settingsApi.updateProfile(formData)
      } else {
        await settingsApi.updateProfile({ fullname, username, bio })
      }
      await refetchUser()
      toast('Profile updated successfully.', 'success')
      setAvatarFile(null)
      setImgError(false)
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(null)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile'
      toast(msg, 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast('Passwords do not match', 'error')
      return
    }

    setIsSavingPassword(true)
    try {
      await settingsApi.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      toast('Password updated successfully.', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password'
      toast(msg, 'error')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const displayAvatarSrc = avatarPreview || user?.avatar_url

  return (
    <div className="max-w-4xl w-full mx-auto py-8 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-zinc-100 font-medium">Settings</h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">Manage your thinker profile and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
          <div className="border-b border-zinc-800/80 pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Thinker Profile
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">Your public identity and avatar across Forge.</p>
          </div>

          {/* Avatar Upload Block */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="relative group">
              {displayAvatarSrc && !imgError ? (
                <img
                  src={displayAvatarSrc}
                  alt="Thinker Avatar"
                  onError={() => setImgError(true)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-pink-950/70 border-2 border-pink-700/50 flex items-center justify-center text-xl font-mono text-pink-300">
                  {(fullname || user?.username || 'T').charAt(0).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-zinc-200 transition-opacity cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Avatar
                </Button>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatarPreview}
                    className="text-xs text-zinc-400 hover:text-rose-400 gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                )}
              </div>
              <p className="text-[11px] font-mono text-zinc-500">
                Supports JPG, PNG, WebP or GIF up to 5MB.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Display Name</label>
                <Input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Thinker Handle</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="thinker"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
              <Input value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">Email is tied to your account identity.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Bio / Focus</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What questions or domains are you currently exploring?"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm outline-none focus:border-pink-500 font-serif leading-relaxed"
              />
            </div>

            <Button type="submit" variant="primary" size="sm" isLoading={isSavingProfile}>
              Save Profile
            </Button>
          </form>
        </div>

      {/* Password Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Change Password
        </h2>
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" variant="secondary" size="sm" isLoading={isSavingPassword}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  </div>
  )
}

