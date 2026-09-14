import React from 'react';
import { Link } from 'react-router-dom';
import { RegistrationForm } from '@/features/auth/components/RegistrationForm';
import { NeuralCanvas } from '@/features/landing/components/NeuralCanvas';
import { isProductionAuthReady } from '@/lib/deployment';

export const RegisterPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12">
      <NeuralCanvas />
      <div className="relative z-10 w-full max-w-md">
        {!isProductionAuthReady() && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center justify-between gap-3">
            <span>Hosted preview backend is paused. Run Rails locally on port 3000 to authenticate.</span>
            <Link to="/faq#deployment" className="underline hover:text-amber-200 shrink-0">FAQ &rarr;</Link>
          </div>
        )}
        <RegistrationForm />
      </div>
    </div>
  );
};
