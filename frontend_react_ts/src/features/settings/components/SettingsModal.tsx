import React, { useState, useRef, useEffect } from 'react'
import {
  User as UserIcon,
  Sparkles,
  Brain,
  MessageSquareCode,
  Shield,
  LogOut,
  BookOpen,
  X,
  Upload,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Plus,
  Edit2,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { settingsApi } from '@/services/api/settingsApi'
import {
  useMemories,
  useCreateMemory,
  useUpdateMemory,
  useDeleteMemory,
  useToggleMemory,
} from '@/features/memories/hooks/useMemories'
import type { UserMemory } from '@/types/fragment.types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'account' | 'personalization' | 'memory' | 'owl' | 'security'
}

const INTEREST_OPTIONS = [
  'Technology',
  'Music',
  'Writing',
  'Design',
  'Programming',
  'Business',
  'Philosophy',
  'Learning',
  'Creativity',
  'Science',
  'Poetry',
  'Storytelling',
]

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'account',
}) => {
  const { user, refetchUser, logout } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<'account' | 'personalization' | 'memory' | 'owl' | 'security'>(
    initialTab
  )

  // Account form state
  const [fullname, setFullname] = useState(user?.fullname || '')
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [preferredName, setPreferredName] = useState(user?.preferred_name || '')
  const [bio, setBio] = useState(user?.bio || '')

  // Date of Birth state (day, month, year)
  const initialDob = user?.date_of_birth ? new Date(user.date_of_birth) : null
  const [dobDay, setDobDay] = useState(initialDob ? String(initialDob.getUTCDate()) : '')
  const [dobMonth, setDobMonth] = useState(initialDob ? String(initialDob.getUTCMonth() + 1) : '')
  const [dobYear, setDobYear] = useState(initialDob ? String(initialDob.getUTCFullYear()) : '')

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Personalization state
  const [interests, setInterests] = useState<string[]>(user?.interests || [])

  // Owl Instructions state
  const [owlInstructions, setOwlInstructions] = useState(user?.owl_instructions || '')

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Delete Account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Memory state & hooks
  const { data: memoryData, isLoading: isMemoriesLoading } = useMemories()
  const { mutateAsync: createMemoryMutate } = useCreateMemory()
  const { mutateAsync: updateMemoryMutate } = useUpdateMemory()
  const { mutateAsync: deleteMemoryMutate } = useDeleteMemory()
  const { mutateAsync: toggleMemoryMutate } = useToggleMemory()

  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [editingMemory, setEditingMemory] = useState<UserMemory | null>(null)
  const [memoryTitle, setMemoryTitle] = useState('')
  const [memoryContent, setMemoryContent] = useState('')

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '')
      setUsername(user.username || '')
      setEmail(user.email || '')
      setPreferredName(user.preferred_name || '')
      setBio(user.bio || '')
      setAvatarPreview(user.avatar_url || null)
      setInterests(user.interests || [])
      setOwlInstructions(user.owl_instructions || '')
      if (user.date_of_birth) {
        const d = new Date(user.date_of_birth)
        setDobDay(String(d.getUTCDate()))
        setDobMonth(String(d.getUTCMonth() + 1))
        setDobYear(String(d.getUTCFullYear()))
      }
    }
  }, [user, isOpen])

  if (!isOpen) return null

  // Calculate derived age
  const calculateAge = (): number | null => {
    if (!dobDay || !dobMonth || !dobYear) return null
    const birth = new Date(Date.UTC(Number(dobYear), Number(dobMonth) - 1, Number(dobDay)))
    if (isNaN(birth.getTime())) return null
    const today = new Date()
    let age = today.getFullYear() - birth.getUTCFullYear()
    const m = today.getMonth() - birth.getUTCMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getUTCDate())) {
      age--
    }
    return age >= 0 ? age : null
  }

  const derivedAge = calculateAge()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please choose a valid image file.', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be smaller than 5MB.', 'error')
      return
    }
    setAvatarFile(file)
    setRemoveAvatar(false)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleInterest = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      let formattedDob: string | undefined = undefined
      if (dobDay && dobMonth && dobYear) {
        const mm = dobMonth.padStart(2, '0')
        const dd = dobDay.padStart(2, '0')
        formattedDob = `${dobYear}-${mm}-${dd}`
      }

      if (avatarFile) {
        const formData = new FormData()
        formData.append('user[fullname]', fullname)
        formData.append('user[username]', username)
        formData.append('user[email]', email)
        formData.append('user[preferred_name]', preferredName)
        formData.append('user[bio]', bio)
        if (formattedDob) formData.append('user[date_of_birth]', formattedDob)
        formData.append('user[owl_instructions]', owlInstructions)
        interests.forEach((it) => formData.append('user[interests][]', it))
        formData.append('user[avatar]', avatarFile)
        await settingsApi.updateProfile(formData)
      } else {
        await settingsApi.updateProfile({
          fullname,
          username,
          email,
          preferred_name: preferredName,
          bio,
          date_of_birth: formattedDob,
          interests,
          owl_instructions: owlInstructions,
          remove_avatar: removeAvatar,
        })
      }

      await refetchUser()
      toast('Preferences saved successfully.', 'success')
    } catch {
      toast('Failed to update settings.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast('Please enter current and new password.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      toast('Passwords do not match.', 'error')
      return
    }
    setIsSaving(true)
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
    } catch {
      toast('Failed to update password. Check current password.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memoryTitle.trim() || !memoryContent.trim()) {
      toast('Please provide a title and memory description.', 'error')
      return
    }

    try {
      if (editingMemory) {
        await updateMemoryMutate({
          id: editingMemory.id,
          payload: { title: memoryTitle.trim(), content: memoryContent.trim() },
        })
        toast('Memory updated.', 'success')
      } else {
        await createMemoryMutate({
          title: memoryTitle.trim(),
          content: memoryContent.trim(),
          source: 'explicit',
        })
        toast('New memory added to Owl context.', 'success')
      }
      setIsAddingMemory(false)
      setEditingMemory(null)
      setMemoryTitle('')
      setMemoryContent('')
    } catch {
      toast('Failed to save memory.', 'error')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast('Type DELETE to confirm permanent removal.', 'error')
      return
    }
    if (!deletePassword) {
      toast('Please provide your account password.', 'error')
      return
    }

    setIsDeletingAccount(true)
    try {
      await settingsApi.deleteAccount(deletePassword, 'DELETE')
      toast('Your account and thoughts have been permanently removed.', 'info')
      await logout()
      window.location.href = '/'
    } catch {
      toast('Failed to delete account. Please verify password.', 'error')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] sm:h-[82vh] max-h-[760px] rounded-2xl bg-zinc-925 border border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-56 shrink-0 bg-zinc-950/80 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col justify-between p-3 sm:p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 mb-2">
              <h2 className="text-sm font-serif font-medium text-zinc-100 tracking-tight">
                Settings
              </h2>
            </div>

            <nav className="space-y-0.5" aria-label="Settings sections">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <UserIcon className="w-4 h-4 text-zinc-400" />
                <span>Account</span>
              </button>

              <button
                onClick={() => setActiveTab('personalization')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'personalization'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Personalization</span>
              </button>

              <button
                onClick={() => setActiveTab('memory')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'memory'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Brain className="w-4 h-4 text-emerald-400" />
                <span>Memory</span>
              </button>

              <button
                onClick={() => setActiveTab('owl')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'owl'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <MessageSquareCode className="w-4 h-4 text-amber-400" />
                <span>Owl Instructions</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Security</span>
              </button>
            </nav>
          </div>

          {/* Bottom Sidebar Actions */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-1">
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Documentation ↗</span>
            </a>
            <button
              onClick={async () => {
                onClose()
                await logout()
                window.location.href = '/'
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-900/40 scrollbar-thin">
          {/* TAB: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-serif font-medium text-zinc-100">
                  Account Details
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage your thinker profile identity and birthday context.
                </p>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Thinker Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-zinc-700 flex items-center justify-center font-mono font-medium text-sm text-zinc-300 shadow-md">
                    {user?.initials || 'TH'}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{avatarPreview ? 'Replace' : 'Upload'}</span>
                    </Button>

                    {avatarPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        className="text-xs text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-[11px] text-zinc-500 font-mono">
                    JPG, PNG or GIF up to 5MB. Uses initials if removed.
                  </p>
                </div>
              </div>

              {/* Account Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
                    Display Name
                  </label>
                  <Input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="thinker"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thinker@modula.local"
                />
              </div>

              {/* Date of Birth & Derived Age */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-zinc-200 pl-1">
                    Date of Birth (Optional)
                  </label>
                  {derivedAge !== null && (
                    <span className="text-[11px] font-mono text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full">
                      Age: {derivedAge} years
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1 pl-1">
                      Day
                    </label>
                    <select
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1 pl-1">
                      Month
                    </label>
                    <select
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Month</option>
                      {[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ].map((name, idx) => (
                        <option key={name} value={idx + 1}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1 pl-1">
                      Year
                    </label>
                    <select
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 90 }, (_, i) => new Date().getFullYear() - i).map(
                        (yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Used for birthday reflections. Age is automatically calculated.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
                  Bio / Context
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-pink-500"
                  placeholder="Short context about yourself..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* TAB: PERSONALIZATION */}
          {activeTab === 'personalization' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-serif font-medium text-zinc-100">
                  Personalization
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Shape how Forge addresses you and choose your theme.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
                  What should Forge call you?
                </label>
                <Input
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Parikesit, Luca, Ari"
                />
                <p className="mt-1.5 text-[11px] text-zinc-500 font-mono">
                  Preferred nickname used in thought timeline and greeting.
                </p>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2 pl-1">
                  Interested in
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((tag) => {
                    const isSelected = interests.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 font-mono">
                  Interests provide subtle context for Owl. They are not rigid assumptions.
                </p>
              </div>

              {/* Theme Picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2 pl-1">
                  Display Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-pink-500 bg-zinc-950 text-zinc-100 shadow-md'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-medium">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'border-pink-500 bg-zinc-950 text-zinc-100 shadow-md'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      theme === 'system'
                        ? 'border-pink-500 bg-zinc-950 text-zinc-100 shadow-md'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium">Device</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* TAB: MEMORY */}
          {activeTab === 'memory' && (
            <div className="space-y-6 max-w-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-serif font-medium text-zinc-100">
                    Transparent Memory
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Memory helps Owl keep useful context across thoughts. Always user-controlled.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingMemory(null)
                    setMemoryTitle('')
                    setMemoryContent('')
                    setIsAddingMemory(true)
                  }}
                  className="flex items-center gap-1.5 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory</span>
                </Button>
              </div>

              {/* Memory Toggle */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-zinc-200">
                    Use memory with Owl
                  </span>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    When enabled, confirmed memories are provided quietly as background context.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMemoryMutate()}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    memoryData?.use_memory ? 'bg-pink-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      memoryData?.use_memory ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Add / Edit Form Modal */}
              {isAddingMemory && (
                <form
                  onSubmit={handleSaveMemory}
                  className="p-4 rounded-2xl bg-zinc-900 border border-pink-500/40 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-medium text-zinc-200">
                      {editingMemory ? 'Edit Memory' : 'New Explicit Memory'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingMemory(false)}
                      className="p-1 text-zinc-400 hover:text-zinc-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <Input
                      value={memoryTitle}
                      onChange={(e) => setMemoryTitle(e.target.value)}
                      placeholder="Topic (e.g. Songwriting, Software, Coffee)"
                      autoFocus
                    />
                  </div>

                  <div>
                    <textarea
                      value={memoryContent}
                      onChange={(e) => setMemoryContent(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-pink-500"
                      placeholder="What should Owl remember about this topic?"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setIsAddingMemory(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save Memory
                    </Button>
                  </div>
                </form>
              )}

              {/* Memory List */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Confirmed Memories ({memoryData?.memories?.length || 0})
                </span>

                {isMemoriesLoading ? (
                  <div className="p-8 text-center text-xs font-mono text-zinc-500">
                    Loading memories...
                  </div>
                ) : !memoryData?.memories?.length ? (
                  <div className="p-8 text-center rounded-2xl bg-zinc-950/40 border border-dashed border-zinc-800 text-xs text-zinc-500 font-serif italic">
                    No memories recorded yet. Add memories explicitly to provide lasting context.
                  </div>
                ) : (
                  memoryData.memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-start justify-between gap-4 group hover:border-zinc-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-200">
                            {mem.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {mem.source}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {mem.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMemory(mem)
                            setMemoryTitle(mem.title)
                            setMemoryContent(mem.content)
                            setIsAddingMemory(true)
                          }}
                          className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded hover:bg-zinc-800"
                          title="Edit memory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMemoryMutate(mem.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800"
                          title="Forget memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: OWL INSTRUCTIONS */}
          {activeTab === 'owl' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-serif font-medium text-zinc-100">
                  Instructions for Owl
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Tell Owl how you prefer to explore thoughts. These instructions shape its
                  approach, not your conclusions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-pink-950/20 border border-pink-500/20 text-xs text-pink-300/90 leading-relaxed space-y-1.5">
                <strong className="block font-medium">Core Rule Guardrail:</strong>
                <p className="text-[11px] leading-relaxed">
                  Custom instructions cannot override Forge&apos;s core principle: <em>Owl observes. The thinker decides.</em> Owl remains a companion and will not make decisions for you.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2 pl-1">
                  Custom Exploration Prompt
                </label>
                <textarea
                  value={owlInstructions}
                  onChange={(e) => setOwlInstructions(e.target.value)}
                  rows={7}
                  className="w-full p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-pink-500 leading-relaxed"
                  placeholder={`"Ask me more questions before offering perspectives."
"Keep observations concise and poetic."
"When I write lyrics, focus on imagery and rhythm."
"Challenge technical assumptions when appropriate."`}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                >
                  Save Instructions
                </Button>
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-base font-serif font-medium text-zinc-100">
                  Security &amp; Password
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage authentication and account credentials.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="space-y-4 p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-xs font-medium text-zinc-200 block">
                  Change Password
                </span>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1 pl-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 pl-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 pl-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={isSaving}
                    onClick={handleSavePassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-medium text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Danger Zone: Delete Account</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Permanently deletes your thinker account, profile, all fragments, thoughts, and
                  saved memories. This action is irreversible.
                </p>
                <div className="pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete Account...
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-rose-800/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-serif text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Delete your Forge account?</span>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              This permanently removes your account and all private Forge data. To confirm, type{' '}
              <strong className="text-rose-400 font-mono">DELETE</strong> below and enter your password.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Type DELETE
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Account Password
                </label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeletingAccount}
                disabled={deleteConfirmText !== 'DELETE' || !deletePassword}
                onClick={handleDeleteAccount}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
