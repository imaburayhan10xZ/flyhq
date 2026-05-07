const fs = require('fs');

let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

const regex = /case 'users':([\s\S]*?)case 'support_channels':/;

const userManagementBlock = `case 'users':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">User & Admin Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage users, adjust roles, and set specific permissions for moderators.</p>
                          </div>
                      </div>
                      <div className="p-6 space-y-4">
                            {usersList.map((u: any) => (
                                <div key={u.id} className="bg-slate-50 p-4 font-sans rounded-xl border border-slate-200">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{u.email}</h4>
                                            <p className="text-sm text-slate-500 capitalize">Role: <span className="font-bold text-primary">{u.role || 'user'}</span></p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <select 
                                                className="bg-white border text-sm font-medium border-slate-300 text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-primary"
                                                value={u.role || 'user'}
                                                onChange={async (e) => {
                                                    const newRole = e.target.value;
                                                    if(u.email === user?.email) {
                                                        toast.error("You cannot change your own role here.");
                                                        return;
                                                    }
                                                    confirmAction('Change Role', \`Are you sure you want to change \${u.email}'s role to \${newRole}?\`, async () => {
                                                        const toastId = toast.loading('Updating role...');
                                                        try {
                                                            await updateUserRoleAndPermissions(u.id, newRole, u.permissions || []);
                                                            setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, role: newRole} : usr));
                                                            toast.success('Role updated', { id: toastId });
                                                        } catch(err) { toast.error('Failed to update', { id: toastId }); }
                                                    });
                                                }}
                                            >
                                                <option value="user">User</option>
                                                <option value="moderator">Moderator</option>
                                                <option value="manager">Manager</option>
                                                {(role === 'super_admin' || u.role === 'admin' || u.role === 'super_admin') && <option value="super_admin">Super Admin</option>}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {u.role === 'moderator' && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <h5 className="font-bold text-slate-700 text-sm mb-3">Moderator Permissions: Select Sections</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {ALL_TABS.map(tab => {
                                                    if (tab.id === 'users' || tab.id === 'overview' || tab.id === 'profile') return null;
                                                    const isChecked = (u.permissions || []).includes(tab.id);
                                                    return (
                                                        <label key={tab.id} className="flex items-center space-x-2 cursor-pointer group">
                                                            <input 
                                                                type="checkbox" 
                                                                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                                                                checked={isChecked}
                                                                onChange={async (e) => {
                                                                    const checked = e.target.checked;
                                                                    let newPerms = [...(u.permissions || [])];
                                                                    if (checked) newPerms.push(tab.id);
                                                                    else newPerms = newPerms.filter(p => p !== tab.id);
                                                                    
                                                                    const toastId = toast.loading('Updating permissions...');
                                                                    try {
                                                                        await updateUserRoleAndPermissions(u.id, u.role, newPerms);
                                                                        setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, permissions: newPerms} : usr));
                                                                        toast.success('Permissions updated', { id: toastId });
                                                                    } catch(err) { toast.error('Failed', { id: toastId }); }
                                                                }}
                                                            />
                                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{tab.label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                      </div>
                  </motion.div>
              );
          case 'support_channels':`;

content = content.replace(regex, userManagementBlock);
fs.writeFileSync('pages/AdminDashboard.tsx', content);
console.log("Replaced user management block");
