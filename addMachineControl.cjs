const fs = require('fs');
let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

const profileCase = "\n        case 'profile':";
const machineControlCase = `
        case 'machine_control':
            return (
                <motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} className="max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                <Server className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Machine Control</h2>
                                <p className="text-slate-500 mt-1 font-medium">Developer tools for system-wide configuration.</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Site Maintenance Mode</h3>
                                        <p className="text-sm text-slate-500">When enabled, the user website and regular admin panel will be unavailable. Only developers can bypass this.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={featuresConfig.maintenanceMode || false} onChange={async (e) => {
                                            const newVal = e.target.checked;
                                            const newConfig = {...featuresConfig, maintenanceMode: newVal};
                                            setFeaturesConfig(newConfig);
                                            const toastId = toast.loading('Saving...');
                                            try {
                                                await saveFeaturesConfig(newConfig);
                                                toast.success('Settings saved', {id: toastId});
                                            } catch(err) { toast.error('Failed to save', {id: toastId}); }
                                        }} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                {featuresConfig.maintenanceMode && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Maintenance Note (Displayed to Users)</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-300 rounded-xl p-4 font-medium h-32 outline-none focus:border-primary disabled:opacity-50"
                                            placeholder="We are currently performing scheduled maintenance..."
                                            value={featuresConfig.maintenanceNote || ''}
                                            onChange={(e) => setFeaturesConfig({...featuresConfig, maintenanceNote: e.target.value})}
                                        ></textarea>
                                        <div className="flex justify-end mt-4">
                                            <button 
                                                className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-primary/90 transition disabled:opacity-50"
                                                onClick={async () => {
                                                    const toastId = toast.loading('Saving note...');
                                                    try {
                                                        await saveFeaturesConfig(featuresConfig);
                                                        toast.success('Note saved', {id: toastId});
                                                    } catch(err) { toast.error('Failed to save', {id: toastId}); }
                                                }}
                                            >
                                                Save Note
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
`;

content = content.replace(profileCase, machineControlCase + profileCase);
fs.writeFileSync('pages/AdminDashboard.tsx', content);
