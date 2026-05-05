const fs = require('fs');

let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

// Ensure firebase/auth and ../firebase are imported
content = content.replace(
  "import { useAuth } from '../components/AuthProvider';",
  "import { useAuth } from '../components/AuthProvider';\nimport { updateProfile, updatePassword } from 'firebase/auth';\nimport { auth } from '../firebase';"
);

// Add the Admin Profile Case
const profileCaseBody = `
        case 'profile':
            return (
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <UserCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Admin Profile</h2>
                            <p className="text-sm font-medium text-slate-500">Manage your personal information and security.</p>
                        </div>
                    </div>
                    
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const displayName = formData.get('displayName') as string;
                        const newPassword = formData.get('newPassword') as string;
                        
                        const promise = (async () => {
                            if (auth.currentUser) {
                                if (displayName && displayName !== auth.currentUser.displayName) {
                                    await updateProfile(auth.currentUser, { displayName });
                                }
                                if (newPassword) {
                                    if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
                                    await updatePassword(auth.currentUser, newPassword);
                                }
                            } else {
                                throw new Error('No authenticated user');
                            }
                        })();
                        
                        toast.promise(promise, {
                            loading: 'Updating profile...',
                            success: 'Profile updated successfully!',
                            error: (err) => err.message || 'Failed to update profile'
                        });
                        
                        e.currentTarget.reset();
                    }} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                            <input 
                                name="displayName"
                                type="text" 
                                defaultValue={auth.currentUser?.displayName || ''}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-slate-700" 
                                placeholder="Admin Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address (Read-Only)</label>
                            <input 
                                type="email" 
                                disabled
                                value={auth.currentUser?.email || ''}
                                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" 
                            />
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-6 !mb-2">
                            <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
                            <p className="text-sm text-slate-500 mb-4">Leave blank to keep your current password.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">New Password <span className="text-slate-400 font-normal">(min 6 chars)</span></label>
                            <input 
                                name="newPassword"
                                type="password" 
                                autoComplete="new-password"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-slate-700" 
                                placeholder="Enter new password"
                            />
                        </div>
                        
                        <div className="pt-6">
                            <button type="submit" className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-500/20">
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            );
`;

content = content.replace("default:\n              return (", profileCaseBody + "\n        default:\n              return (");

fs.writeFileSync('pages/AdminDashboard.tsx', content);
console.log("Profile added.");
