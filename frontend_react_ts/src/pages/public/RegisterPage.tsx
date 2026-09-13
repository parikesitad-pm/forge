import React from 'react'
import { RegistrationForm } from '@/features/auth/components/RegistrationForm'
import { NeuralCanvas } from '@/features/landing/components/NeuralCanvas'

export const RegisterPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12">
      <NeuralCanvas />
      <div className="relative z-10 w-full max-w-md">
        <RegistrationForm />
      </div>
    </div>
  )
}
