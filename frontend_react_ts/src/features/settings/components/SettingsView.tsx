import React, { useState, useRef, useMemo } from 'react'
import {
  Upload,
  User as UserIcon,
  Moon,
  Sun,
  Laptop,
  Sparkles,
  KeyRound,
  Check,
} from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme, type Theme } from '@/app/providers/ThemeProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { settingsApi } from '@/services/api/settingsApi'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

export const SettingsView: React.FC = () => {
  const { user, refetchUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Profile fields state
  const [fullname, setFullname] = useState(user?.fullname || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Formatted Thinker Since
  const thinkerSince = useMemo(() => {
    if (!user?.created_at) return 'Thinker since 2026'
    try {
      const d = new Date(user.created_at)
      return `Thinker since ${d.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })}`
    } catch {
      return 'Thinker since 2026'
    }
  }, [user?.created_at])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast('File avatar maksimal 5MB', 'error')
      return
    }

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadAvatar = async () => {
    if (!avatarFile) return

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('user[avatar]', avatarFile)

      await settingsApi.updateProfile(formData)
      await refetchUser()
      setAvatarFile(null)
      setAvatarPreview(null)
      toast('Avatar berhasil diperbarui.', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah avatar'
      toast(msg, 'error')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await settingsApi.updateProfile({ fullname, username, bio })
      await refetchUser()
      toast('Profil berhasil disimpan.', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan profil'
      toast(msg, 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast('Konfirmasi password tidak cocok', 'error')
      return
    }

    setIsSavingPassword(true)
    try {
      await settingsApi.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      toast('Password berhasil diperbarui.', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui password'
      toast(msg, 'error')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const themeOptions: { id: Theme; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'dark',
      label: 'Dark Theme',
      desc: 'Ambient midnight palette',
      icon: <Moon className="w-4 h-4 text-pink-400" />,
    },
    {
      id: 'light',
      label: 'Light Theme',
      desc: 'Editorial paper clean canvas',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'system',
      label: 'Device Theme',
      desc: 'Sync automatically with OS',
      icon: <Laptop className="w-4 h-4 text-zinc-400" />,
    },
  ]

  const currentDisplayAvatar = avatarPreview || user?.avatar_url

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-10">
      <div>
        <h1 className="text-2xl font-serif text-zinc-100 font-medium">
          Thinker Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Kelola profil thinker, avatar, tampilan tema, dan kredensial keamanan.
        </p>
      </div>

      {/* 1. Thinker Identity & Avatar Upload Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-pink-400" />
            Thinker Identity
          </h2>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-850 px-2.5 py-1 rounded-full border border-zinc-750">
            {thinkerSince}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            {currentDisplayAvatar ? (
              <img
                src={currentDisplayAvatar}
                alt="Thinker Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-pink-500/40 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-pink-950/80 border-2 border-pink-500/40 flex items-center justify-center text-xl font-mono text-pink-300 shadow-lg">
                {(user?.fullname || user?.username || 'P').charAt(0).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-zinc-200 cursor-pointer text-xs"
              title="Ganti avatar"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          {/* File Picker & Actions */}
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Gambar
              </Button>

              {avatarFile && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleUploadAvatar}
                  isLoading={isUploadingAvatar}
                  disabled={isUploadingAvatar}
                >
                  Unggah Avatar
                </Button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              Format: PNG, JPG, GIF atau WEBP. Maksimal 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Display & Theme Setting Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Display Theme
        </h2>
        <p className="text-xs text-zinc-400">
          Pilih tema tampilan favorit kamu. Mode dark aktif secara default tanpa efek flashbang saat refresh.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id)
                  toast(`Tema diubah ke ${opt.label}`, 'info')
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-pink-500/80 bg-pink-500/10 shadow-sm shadow-pink-500/10'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    {opt.icon}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                </div>
                <div>
                  <p className={`text-xs font-medium ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Thinker Profile Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-pink-400" />
          Profil Thinker
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Nama Panggilan (Display Name)
            </label>
            <Input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nama panggilan kamu"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="thinker"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Email
            </label>
            <Input
              value={user?.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Email terikat sebagai identitas login kamu.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Bio / Eksplorasi Kreatif
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Pertanyaan, intuisi, atau topik apa yang sedang kamu selidiki di Forge?"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSavingProfile}
            disabled={isSavingProfile}
          >
            Simpan Profil
          </Button>
        </form>
      </div>

      {/* 4. Password Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-zinc-400" />
          Ubah Password
        </h2>
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Password Saat Ini
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Password Baru
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Konfirmasi Password Baru
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            isLoading={isSavingPassword}
            disabled={isSavingPassword}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}
