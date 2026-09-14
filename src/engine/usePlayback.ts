import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AlgorithmStep } from '../types/algorithm';

interface UsePlaybackOptions {
  baseIntervalMs?: number;
}

export function usePlayback<T>(steps: AlgorithmStep<T>[], options: UsePlaybackOptions = {}) {
  const { baseIntervalMs = 1200 } = options;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.25, 0.5, 1, 1.5, 2, 3
  const timerRef = useRef<number | null>(null);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || null;

  // Trigger celebration confetti on FOUND or COMPLETE
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#10b981', '#a855f7'],
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        const nextIdx = prev + 1;
        const nextStepObj = steps[nextIdx];
        if (nextStepObj && (nextStepObj.actionType === 'FOUND' || nextStepObj.actionType === 'COMPLETE')) {
          triggerCelebration();
        }
        return nextIdx;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [totalSteps, steps, triggerCelebration]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      if (steps[index]?.actionType === 'FOUND' || steps[index]?.actionType === 'COMPLETE') {
        triggerCelebration();
      }
    }
  }, [totalSteps, steps, triggerCelebration]);

  const play = useCallback(() => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(150, Math.round(baseIntervalMs / speed));
      timerRef.current = window.setTimeout(() => {
        if (currentStepIndex < totalSteps - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentStepIndex, totalSteps, speed, baseIntervalMs, nextStep]);

  // Reset index when steps array changes completely
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === totalSteps - 1,
    progressPercent: totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0,
  };
}
