import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas'
import { useAuth } from '@/app/providers/AuthProvider'
import { useToast } from '@/app/providers/ToastProvider'
import { useDebounce } from '@/hooks/useDebounce'
import { authApi } from '@/services/api/authApi'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { BrandLogo } from '@/components/atoms/BrandLogo'

export const RegistrationForm: React.FC = () => {
  const { register: registerUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean
    available: boolean | null
    message?: string
  }>({ checking: false, available: null })
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean
    available: boolean | null
    message?: string
  }>({ checking: false, available: null })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const watchedUsername = watch('username')
  const debouncedUsername = useDebounce(watchedUsername, 350)
  const watchedEmail = watch('email')
  const debouncedEmail = useDebounce(watchedEmail, 350)
  const watchedPassword = watch('password') || ''
  const watchedConfirmation = watch('password_confirmation') || ''

  // Debounced username check
  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setUsernameStatus({ checking: false, available: null })
      return
    }

    let isMounted = true
    setUsernameStatus({ checking: true, available: null })

    authApi
      .checkUsername(debouncedUsername)
      .then((res) => {
        if (isMounted) {
          setUsernameStatus({
            checking: false,
            available: res.available,
            message: res.message,
          })
        }
      })
      .catch(() => {
        if (isMounted) {
          setUsernameStatus({ checking: false, available: null })
        }
      })

    return () => {
      isMounted = false
    }
  }, [debouncedUsername])

  // Debounced email check
  useEffect(() => {
    if (!debouncedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)) {
      setEmailStatus({ checking: false, available: null })
      return
    }

    let isMounted = true
    setEmailStatus({ checking: true, available: null })

    authApi
      .checkEmail(debouncedEmail)
      .then((res) => {
        if (isMounted) {
          setEmailStatus({
            checking: false,
            available: res.available,
            message: res.message,
          })
        }
      })
      .catch(() => {
        if (isMounted) {
          setEmailStatus({ checking: false, available: null })
        }
      })

    return () => {
      isMounted = false
    }
  }, [debouncedEmail])

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    if (usernameStatus.available === false) {
      setServerError('Please choose an available username.')
      return
    }
    if (emailStatus.available === false) {
      setServerError('This email address is already registered.')
      return
    }

    try {
      await registerUser(data)
      // Flag for new registration onboarding modal
      sessionStorage.setItem('forge_show_onboarding', 'true')
      toast('Welcome to Forge. Your thinking space is ready.', 'success')
      navigate('/app')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setServerError(msg)
    }
  }

  // Password rules evaluation
  const hasLength = watchedPassword.length >= 8
  const hasUpper = /[A-Z]/.test(watchedPassword)
  const hasLower = /[a-z]/.test(watchedPassword)
  const hasNumber = /\d/.test(watchedPassword)
  const hasSymbol = /[!@#$%^&*]/.test(watchedPassword)
  const passwordsMatch = watchedPassword && watchedPassword === watchedConfirmation

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center text-center mb-8">
        <BrandLogo size="lg" showSubBrand className="mb-4" />
        <h1 className="text-xl font-medium text-zinc-100 mt-2">Plant your first seed</h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Create a private space for unfinished thoughts.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Full Name / Thinker Alias
          </label>
          <Input
            placeholder="Creative Thinker"
            autoComplete="name"
            error={errors.fullname?.message}
            {...register('fullname')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Thinker Handle (Username)
          </label>
          <div className="relative">
            <Input
              placeholder="thinker"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />
            {watchedUsername && watchedUsername.length >= 3 && (
              <div className="absolute right-3 top-3 text-xs">
                {usernameStatus.checking ? (
                  <span className="text-zinc-500 animate-pulse">checking...</span>
                ) : usernameStatus.available === true ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> available
                  </span>
                ) : usernameStatus.available === false ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> taken
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Email Address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="thinker@modula.local"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            {watchedEmail && watchedEmail.includes('@') && (
              <div className="absolute right-3 top-3 text-xs">
                {emailStatus.checking ? (
                  <span className="text-zinc-500 animate-pulse">checking...</span>
                ) : emailStatus.available === true ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> available
                  </span>
                ) : emailStatus.available === false ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> taken
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password checklist */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] text-zinc-400 pl-1">
            <span className={`flex items-center gap-1 ${hasLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {hasLength ? '✓' : '○'} 8+ characters
            </span>
            <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {hasUpper ? '✓' : '○'} Uppercase letter
            </span>
            <span className={`flex items-center gap-1 ${hasLower ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {hasLower ? '✓' : '○'} Lowercase letter
            </span>
            <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {hasNumber ? '✓' : '○'} Number
            </span>
            <span className={`flex items-center gap-1 ${hasSymbol ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {hasSymbol ? '✓' : '○'} Symbol (!@#$%^&*)
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Confirm Password
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />
          {watchedConfirmation && (
            <p className={`mt-1.5 text-[11px] pl-1 ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          Create Thinking Space
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
        <p className="text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
