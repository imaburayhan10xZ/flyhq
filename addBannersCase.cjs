const fs = require('fs');
let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

const target = "case 'blog':";
const replacement = `case 'banners':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Banners & Slides</h2>
                              <p className="text-sm text-slate-500 mt-1">Manage image slides that appear on the homepage.</p>
                          </div>
                          <button onClick={() => openModal('banner')} className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl transition flex items-center shadow-sm">
                              <Plus className="w-5 h-5 mr-2" /> Add Banner
                          </button>
                      </div>
                      <div className="p-6">
                            {banners.sort((a,b) => a.order - b.order).map(b => (
                                <div key={b.id} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                            {b.imageUrl ? <img src={b.imageUrl} alt="Banner" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400 m-auto mt-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{b.title || 'Untitled Banner'}</h4>
                                            <p className="text-sm text-slate-500">Order: {b.order} | Status: <span className={b.isActive ? "text-green-600 font-medium" : "text-slate-400"}>{b.isActive ? "Active" : "Inactive"}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <button onClick={() => openModal('banner', b)} className="flex-1 md:flex-none text-blue-500 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-center">Edit</button>
                                        <button onClick={async () => {
                                            confirmAction('Delete Banner', 'Are you sure you want to delete this banner?', async () => {
                                                const toastId = toast.loading('Deleting...');
                                                try {
                                                    await deleteBanner(b.id);
                                                    setBanners(banners.filter(ban => ban.id !== b.id));
                                                    toast.success('Deleted', {id: toastId});
                                                } catch(err) { toast.error('Failed to delete', {id: toastId}); }
                                            });
                                        }} className="flex-1 md:flex-none text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition text-center">Delete</button>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && <div className="text-center py-12 text-slate-500">No banners added yet.</div>}
                      </div>
                  </motion.div>
              );
          case 'blog':`;

content = content.replace(target, replacement);
fs.writeFileSync('pages/AdminDashboard.tsx', content);
