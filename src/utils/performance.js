export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const measurePerformance = (componentName, callback) => {
  const start = performance.now();
  const result = callback();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16.67) { // 60fps threshold
    console.warn(`⚠️ ${componentName} took ${duration.toFixed(2)}ms (>16.67ms)`);
  }
  
  return result;
};
