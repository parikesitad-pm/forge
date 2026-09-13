import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFragments } from '@/features/fragments/hooks/useFragments';
import { Spinner } from '@/components/atoms/Spinner';

export const ContinueThinkingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: fragments, isLoading, isError } = useFragments();

  useEffect(() => {
    if (isLoading) return;

    if (!isError && fragments && fragments.length > 0) {
      navigate(`/app/fragments/${fragments[0].id}`, { replace: true });
    } else {
      navigate('/app', { replace: true });
    }
  }, [fragments, isLoading, isError, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-500">
      <Spinner size="lg" />
      <span className="text-xs font-mono">Continuing thinking...</span>
    </div>
  );
};
