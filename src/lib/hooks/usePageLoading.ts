"use client";

import { useEffect, useState } from "react";

interface UsePageLoadingOptions {
  initialDelay?: number;
  minimumLoadingTime?: number;
}

/**
 * Hook to manage page loading states
 * @param options Configuration options
 * @returns Object containing loading state and handler functions
 */
const usePageLoading = ({
  initialDelay = 800,
  minimumLoadingTime = 800,
}: UsePageLoadingOptions = {}) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial page loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  /**
   * Start loading state with minimum display time
   */
  const startLoading = () => {
    setIsLoading(true);
  };

  /**
   * End loading state with respect to minimum display time
   */
  const endLoading = () => {
    setIsLoading(false);
  };

  /**
   * Run an async operation with loading state
   * @param asyncOperation The async function to execute
   * @returns The result of the async operation
   */
  const withLoading = async <T>(
    asyncOperation: () => Promise<T>,
  ): Promise<T> => {
    try {
      const startTime = Date.now();
      startLoading();
      const result = await asyncOperation();

      // Ensure minimum loading time is respected
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minimumLoadingTime) {
        await new Promise(resolve =>
          setTimeout(resolve, minimumLoadingTime - elapsedTime),
        );
      }

      return result;
    } finally {
      endLoading();
    }
  };

  return {
    initialLoading,
    isLoading,
    startLoading,
    endLoading,
    withLoading,
  };
};

export default usePageLoading;
