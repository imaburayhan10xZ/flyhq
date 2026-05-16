const fs = require('fs');
let content = fs.readFileSync('pages/HomePage.tsx', 'utf8');

const target = "      {/* Blog */}";
const replacement = `      {/* Banner Carousel */}
      {banners.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12 relative z-10">
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={currentBanner}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 w-full h-full"
                      >
                          {banners[currentBanner].link ? (
                              <a href={banners[currentBanner].link} target="_blank" rel="noreferrer" className="block w-full h-full">
                                  <img src={banners[currentBanner].imageUrl} alt={banners[currentBanner].title || 'Banner'} className="w-full h-full object-cover" />
                              </a>
                          ) : (
                              <img src={banners[currentBanner].imageUrl} alt={banners[currentBanner].title || 'Banner'} className="w-full h-full object-cover" />
                          )}
                      </motion.div>
                  </AnimatePresence>
                  
                  {/* Controls */}
                  {banners.length > 1 && (
                      <>
                          <button onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity dropdown-shadow">
                              <span className="sr-only">Previous</span>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <button onClick={() => setCurrentBanner(prev => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity dropdown-shadow">
                              <span className="sr-only">Next</span>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {banners.map((_, idx) => (
                                  <button key={idx} onClick={() => setCurrentBanner(idx)} className={\`w-2 h-2 rounded-full transition-all \${currentBanner === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}\`}></button>
                              ))}
                          </div>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Blog */}`;

content = content.replace(target, replacement);
fs.writeFileSync('pages/HomePage.tsx', content);
