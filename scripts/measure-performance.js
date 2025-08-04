// Performance measurement script
// Add this to any page to measure text rendering performance

(function () {
  if (typeof window === "undefined") return;

  const measureTextRenderingPerformance = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "paint") {
          console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        }
        if (entry.entryType === "largest-contentful-paint") {
          console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] });
    } catch (e) {
      console.warn("Performance observation not supported");
    }

    // Measure font load time
    if ("fonts" in document) {
      const fontLoadStart = performance.now();
      document.fonts.ready.then(() => {
        const fontLoadTime = performance.now() - fontLoadStart;
        console.log(`Font load time: ${fontLoadTime.toFixed(2)}ms`);
      });
    }

    // Measure DOM content loaded
    const navigationStart = performance.timing.navigationStart;
    const domContentLoaded = performance.timing.domContentLoadedEventEnd;
    const domLoadTime = domContentLoaded - navigationStart;
    console.log(`DOM Content Loaded: ${domLoadTime}ms`);
  };

  // Run measurements after a small delay
  setTimeout(measureTextRenderingPerformance, 100);
})();
