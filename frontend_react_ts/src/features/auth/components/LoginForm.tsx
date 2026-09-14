import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { BrandLogo } from '@/components/atoms/BrandLogo';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      toast('Welcome back to your thinking space.', 'success');
      navigate('/app', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setServerError(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center text-center mb-8">
        <BrandLogo size="lg" showSubBrand className="mb-4" />
        <h1 className="text-xl font-medium text-zinc-100 mt-2">Welcome back</h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Continue where your thoughts left off.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/70 border border-zinc-700/50 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          <span>
            Cloud Backend:{' '}
            <strong className="text-zinc-300 font-normal">Coming Soon</strong>{' '}
            (Token Expired)
          </span>
        </div>
      </div>

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Email or Username
          </label>
          <Input
            placeholder="thinker@modula.local"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register('identifier')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5 pl-1">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
        >
          Enter Thinking Workspace
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
        <p className="text-xs text-zinc-400">
          First time here?{' '}
          <Link
            to="/register"
            className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            Plant your first seed
          </Link>
        </p>
      </div>
    </div>
  );
};
