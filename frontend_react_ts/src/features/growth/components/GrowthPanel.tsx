import React, { useState } from 'react';
import { Compass, RefreshCw, X } from 'lucide-react';
import { useGrowth } from '../hooks/useGrowth';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';

interface GrowthPanelProps {
  fragmentId: number | string;
}

export const GrowthPanel: React.FC<GrowthPanelProps> = ({ fragmentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: growth,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGrowth(isOpen ? fragmentId : undefined);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
      >
        <Compass className="w-3.5 h-3.5 text-emerald-400" />
        <span>Synthesize Growth</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-700 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Compass className="w-4 h-4" />
                <span>Knowledge Taking Shape</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-800"
                  title="Refresh Synthesis"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-800"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-6">
              {isLoading || isFetching ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
                  <Spinner size="md" />
                  <p className="text-xs font-mono">
                    Owl is reflecting on your seed and sparks...
                  </p>
                </div>
              ) : isError || !growth ? (
                <div className="py-8 text-center text-xs text-rose-400">
                  Unable to synthesize growth at this moment. Add more thoughts
                  or sparks first.
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-serif text-zinc-100 font-medium">
                      {growth.headline}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 font-mono">
                      Reflecting on {growth.sparks_count} kept Sparks
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <p className="text-sm text-zinc-300 font-serif leading-relaxed whitespace-pre-wrap">
                      {growth.reflection}
                    </p>
                  </div>

                  {growth.tensions && growth.tensions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-mono uppercase text-zinc-500 tracking-wider">
                        Emerging Creative Tensions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {growth.tensions.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-zinc-800/70 border border-zinc-700/60 text-xs text-zinc-300 font-serif"
                          >
                            &bull; {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {growth.invitation && (
                    <div className="p-4 rounded-xl bg-pink-950/15 border border-pink-500/20 text-xs text-pink-200 leading-relaxed font-serif italic">
                      <span className="font-sans not-italic font-semibold text-pink-400 block mb-1">
                        Inquiry:
                      </span>
                      &ldquo;{growth.invitation}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 text-right">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Return to Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
