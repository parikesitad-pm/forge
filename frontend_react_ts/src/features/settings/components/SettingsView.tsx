import React, { useState } from 'react'
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
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await settingsApi.updateProfile({ fullname, username, bio })
      await refetchUser()
      toast('Profile updated successfully.', 'success')
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

  return (
    <div className="max-w-xl mx-auto py-8 space-y-12">
      <div>
        <h1 className="text-2xl font-serif text-zinc-100 font-medium">Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your thinker profile and credentials.</p>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Thinker Profile
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Display Name</label>
            <Input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="thinker"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
            <Input value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
            <p className="text-[10px] text-zinc-500 mt-1">Email is tied to your account identity.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Bio / Focus</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What questions or domains are you currently exploring?"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm outline-none focus:border-pink-500"
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
  )
}
