import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'student_daily_planner_onboarding_complete';

export const useOnboarding = () => {
  const [isComplete, setIsComplete] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  // Show onboarding for new users who haven't completed it
  const [showOnboarding, setShowOnboarding] = useState(!isComplete);

  useEffect(() => {
    if (isComplete) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  }, [isComplete]);

  const completeOnboarding = () => {
    setIsComplete(true);
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setIsComplete(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};
