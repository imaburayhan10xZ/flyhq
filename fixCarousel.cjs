const fs = require('fs');

let content = fs.readFileSync('pages/HomePage.tsx', 'utf8');

const oldInterval = `  useEffect(() => {
     if (banners.length <= 1) return;
     const interval = setInterval(() => {
         setCurrentBanner(prev => (prev + 1) % banners.length);
     }, 4000); // 4 seconds
     return () => clearInterval(interval);
  }, [banners.length]);`;

const newInterval = `  useEffect(() => {
     if (banners.length <= 4) return;
     const interval = setInterval(() => {
         setCurrentBanner(prev => {
             const maxIndex = Math.max(0, banners.length - 4);
             return prev >= maxIndex ? 0 : prev + 1;
         });
     }, 4000); // 4 seconds
     return () => clearInterval(interval);
  }, [banners.length]);`;

content = content.replace(oldInterval, newInterval);

const target = `      {/* Banner Carousel */}
      {banners.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12 relative z-10">
              <div className="relative w-full h-[100px] sm:h-[130px] md:h-[160px] lg:h-[200px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 group">
                  <AnimatePresence mode="popLayout">
                      <motion.div
                          key={currentBanner}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 w-full h-full"
                      >
                          <img src={banners[currentBanner].imageUrl} alt="Banner" className="w-full h-full object-cover" />
                      </motion.div>
                  </AnimatePresence>
                  
                  {/* Controls */}
                  {banners.length > 1 && (
                      <>
                          <button onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity dropdown-shadow z-20">
                              <span className="sr-only">Previous</span>
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <button onClick={() => setCurrentBanner(prev => (prev + 1) % banners.length)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity dropdown-shadow z-20">
                              <span className="sr-only">Next</span>
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                              {banners.map((_, idx) => (
                                  <button key={idx} onClick={() => setCurrentBanner(idx)} className={\`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all \${currentBanner === idx ? 'bg-white w-3 sm:w-4' : 'bg-white/50 hover:bg-white/80'}\`}></button>
                              ))}
                          </div>
                      </>
                  )}
              </div>
          </div>
      )}`;

const replacement = `      {/* Banner Carousel */}
      {banners.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 relative z-10">
              <div className="relative w-full overflow-hidden group pb-4">
                  <div 
                      className="flex transition-transform duration-500 ease-in-out" 
                      style={{ 
                          transform: \`translateX(-\${currentBanner * (100 / Math.min(4, Math.max(1, banners.length))) }%)\` 
                      }}
                  >
                      {banners.map((b: any, idx: number) => (
                          <div 
                              key={b.id || idx} 
                              className="px-2 shrink-0" 
                              style={{ 
                                  width: \`\${100 / Math.min(4, Math.max(1, banners.length))}%\` 
                              }}
                          >
                              <div className="w-full aspect-[21/9] sm:aspect-[16/9] md:aspect-[3/1] lg:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
                                  <img src={b.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  {/* Controls */}
                  {banners.length > 4 && (
                      <>
                          <button 
                              onClick={() => setCurrentBanner(prev => Math.max(0, prev - 1))} 
                              disabled={currentBanner === 0}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 disabled:hover:bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                          >
                              <span className="sr-only">Previous</span>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <button 
                              onClick={() => setCurrentBanner(prev => Math.min(banners.length - 4, prev + 1))} 
                              disabled={currentBanner >= banners.length - 4}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 disabled:hover:bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                          >
                              <span className="sr-only">Next</span>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                      </>
                  )}
              </div>
          </div>
      )}`;

content = content.replace(target, replacement);
fs.writeFileSync('pages/HomePage.tsx', content);
