import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Sparkles } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';

export const CaptureDemo: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 3000);
    const timer2 = setTimeout(() => setStep(2), 6500);
    const timer3 = setTimeout(() => setStep(0), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [step]);

  return (
    <section
      id="how-it-works"
      className="relative z-10 py-16 px-6 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
          Interactive Thought Capture
        </p>
        <h2 className="text-2xl font-medium text-zinc-200">
          How thoughts enter Forge
        </h2>
      </div>

      <div className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2 font-mono text-[11px] text-zinc-400">
              fragment.workspace
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step === 0 && <Badge variant="default">Raw Input</Badge>}
            {step === 1 && <Badge variant="seed">Anchor &middot; Seed</Badge>}
            {step === 2 && <Badge variant="owl">Owl Observing</Badge>}
          </div>
        </div>

        <div className="min-h-[160px] flex flex-col justify-center py-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-left"
              >
                <p className="text-xs font-mono text-zinc-500 mb-2">
                  Raw Thought Stream:
                </p>
                <p className="text-lg sm:text-xl text-zinc-200 font-serif italic">
                  &ldquo;Maybe I&rsquo;m not struggling with focus... maybe
                  I&rsquo;m struggling with choosing what deserves my
                  attention.&rdquo;
                </p>
                <span className="inline-block w-1.5 h-4 bg-pink-500 ml-1 animate-pulse" />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-xl bg-zinc-950/60 border border-emerald-500/20 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5" />
                  Seed Planted
                </div>
                <p className="text-base sm:text-lg text-zinc-100 font-serif leading-relaxed">
                  &ldquo;Maybe I&rsquo;m not struggling with focus... maybe
                  I&rsquo;m struggling with choosing what deserves my
                  attention.&rdquo;
                </p>
                <p className="mt-3 text-xs text-zinc-500">
                  This thought becomes the anchor. No tags, no folder, no
                  premature categorization.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-left"
              >
                <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
                  <p className="text-xs font-mono text-zinc-500 mb-1">Seed:</p>
                  <p className="text-sm text-zinc-300 font-serif italic">
                    &ldquo;Maybe I&rsquo;m not struggling with focus... maybe
                    I&rsquo;m struggling with choosing what deserves my
                    attention.&rdquo;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30">
                  <div className="flex items-center justify-between text-xs text-pink-400 mb-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5" /> Owl Observation
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Curious inquiry
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                    You seem to draw a boundary between the capacity to focus
                    and the permission to decide. What would it feel like if
                    choosing meant letting go of other possibilities?
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 hover:bg-amber-500/20 transition-colors">
                      ✦ Keep as Spark
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      You decide if this matters.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-800/60">
          <button
            onClick={() => setStep(0)}
            className={`w-2 h-2 rounded-full transition-all ${step === 0 ? 'w-6 bg-pink-500' : 'bg-zinc-700'}`}
            aria-label="Demo step 1"
          />
          <button
            onClick={() => setStep(1)}
            className={`w-2 h-2 rounded-full transition-all ${step === 1 ? 'w-6 bg-pink-500' : 'bg-zinc-700'}`}
            aria-label="Demo step 2"
          />
          <button
            onClick={() => setStep(2)}
            className={`w-2 h-2 rounded-full transition-all ${step === 2 ? 'w-6 bg-pink-500' : 'bg-zinc-700'}`}
            aria-label="Demo step 3"
          />
        </div>
      </div>
    </section>
  );
};
