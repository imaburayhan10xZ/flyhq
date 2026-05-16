const fs = require('fs');

let content = fs.readFileSync('pages/HomePage.tsx', 'utf8');

const targetState = `  const [banners, setBanners] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);`;

const replacementState = `  const [banners, setBanners] = useState<any[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 640) setItemsPerView(1);
          else if (window.innerWidth < 1024) setItemsPerView(2);
          else setItemsPerView(4);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);`;

content = content.replace(targetState, replacementState);

const targetEffect = `  useEffect(() => {
     if (banners.length <= 4) return;
     const interval = setInterval(() => {
         setCurrentBanner(prev => {
             const maxIndex = Math.max(0, banners.length - 4);
             return prev >= maxIndex ? 0 : prev + 1;
         });
     }, 4000); // 4 seconds
     return () => clearInterval(interval);
  }, [banners.length]);`;

const replacementEffect = `  useEffect(() => {
     if (banners.length <= itemsPerView) return;
     const interval = setInterval(() => {
         setCurrentBanner(prev => {
             const maxIndex = Math.max(0, banners.length - itemsPerView);
             return prev >= maxIndex ? 0 : prev + 1;
         });
     }, 4000); // 4 seconds
     return () => clearInterval(interval);
  }, [banners.length, itemsPerView]);

  // Reset current banner if resizing causes it to go out of bounds
  useEffect(() => {
      if (currentBanner > Math.max(0, banners.length - itemsPerView)) {
          setCurrentBanner(Math.max(0, banners.length - itemsPerView));
      }
  }, [itemsPerView, banners.length, currentBanner]);`;

content = content.replace(targetEffect, replacementEffect);

const targetCarousel = `      {/* Banner Carousel */}
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

const replacementCarousel = `      {/* Banner Carousel */}
      {banners.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 relative z-10">
              <div className="relative w-full overflow-hidden group pb-4">
                  <div 
                      className="flex transition-transform duration-500 ease-in-out" 
                      style={{ 
                          transform: \`translateX(-\${currentBanner * (100 / Math.min(itemsPerView, Math.max(1, banners.length))) }%)\` 
                      }}
                  >
                      {banners.map((b: any, idx: number) => (
                          <div 
                              key={b.id || idx} 
                              className="px-2 shrink-0" 
                              style={{ 
                                  width: \`\${100 / Math.min(itemsPerView, Math.max(1, banners.length))}%\` 
                              }}
                          >
                              <div className="w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
                                  <img src={b.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  {/* Controls */}
                  {banners.length > itemsPerView && (
                      <>
                          <button 
                              onClick={() => setCurrentBanner(prev => Math.max(0, prev - 1))} 
                              disabled={currentBanner === 0}
                              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 disabled:hover:bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                          >
                              <span className="sr-only">Previous</span>
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <button 
                              onClick={() => setCurrentBanner(prev => Math.min(banners.length - itemsPerView, prev + 1))} 
                              disabled={currentBanner >= banners.length - itemsPerView}
                              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 disabled:hover:bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                          >
                              <span className="sr-only">Next</span>
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                      </>
                  )}
              </div>
          </div>
      )}`;

content = content.replace(targetCarousel, replacementCarousel);
fs.writeFileSync('pages/HomePage.tsx', content);
