const fs = require('fs');
let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

const renderContentHeader = "  const renderContent = () => {";
const secureRenderContentHeader = `  const renderContent = () => {
      // Security check
      if (role === 'manager' && activeTab === 'users') {
          return <div className="p-10 text-center text-slate-500"><h2 className="text-2xl font-bold">Access Denied</h2><p>You do not have permission to view this section.</p></div>;
      }
      if (role === 'moderator' && activeTab !== 'overview' && activeTab !== 'profile' && !(permissions || []).includes(activeTab)) {
          return <div className="p-10 text-center text-slate-500"><h2 className="text-2xl font-bold">Access Denied</h2><p>You do not have permission to view this section.</p></div>;
      }
`;

content = content.replace(renderContentHeader, secureRenderContentHeader);
fs.writeFileSync('pages/AdminDashboard.tsx', content);
