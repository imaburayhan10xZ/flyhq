const fs = require('fs');

let content = fs.readFileSync('pages/AdminDashboard.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { useAuth } from '../components/AuthProvider';",
  "import { useAuth } from '../components/AuthProvider';\nimport toast, { Toaster } from 'react-hot-toast';\nimport { ConfirmDialog } from '../components/ConfirmDialog';\nimport { UserCircle } from 'lucide-react';"
);

// Add state for ConfirmDialog and Profile tab
content = content.replace(
  "  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);",
  "  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);\n  const [confirmOptions, setConfirmOptions] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);\n\n  const confirmAction = (title: string, message: string, onConfirm: () => void) => {\n      setConfirmOptions({ isOpen: true, title, message, onConfirm: () => {\n          onConfirm();\n          setConfirmOptions(null);\n      }});\n  };"
);

// Replace handleDeleteHotel
content = content.replace(
  /const handleDeleteHotel = async \(id: string\) => \{\s+if\(window\.confirm\('Are you sure you want to delete this hotel\?'\)\) \{\s+await deleteHotelOffer\(id\);\s+setHotels\(hotels\.filter\(h => h\.id !== id\)\);\s+\}\s+\}/,
  `const handleDeleteHotel = (id: string) => {
      confirmAction('Delete Hotel', 'Are you sure you want to delete this hotel?', async () => {
          const toastId = toast.loading('Deleting...');
          try {
             await deleteHotelOffer(id);
             setHotels(hotels.filter(h => h.id !== id));
             toast.success('Hotel deleted', { id: toastId });
          } catch(e) {
             toast.error('Failed to delete', { id: toastId });
          }
      });
  }`
);

// Replace handleDeleteHoliday
content = content.replace(
  /const handleDeleteHoliday = async \(id: string\) => \{\s+if\(window\.confirm\('Are you sure you want to delete this holiday\?'\)\) \{\s+await deleteHolidayPackage\(id\);\s+setHolidays\(holidays\.filter\(h => h\.id !== id\)\);\s+\}\s+\}/,
  `const handleDeleteHoliday = (id: string) => {
      confirmAction('Delete Holiday', 'Are you sure you want to delete this holiday?', async () => {
          const toastId = toast.loading('Deleting...');
          try {
             await deleteHolidayPackage(id);
             setHolidays(holidays.filter(h => h.id !== id));
             toast.success('Holiday deleted', { id: toastId });
          } catch(e) {
             toast.error('Failed to delete', { id: toastId });
          }
      });
  }`
);

// Replace handleDeleteVisa
content = content.replace(
  /const handleDeleteVisa = async \(id: string\) => \{\s+if\(window\.confirm\('Are you sure you want to delete this visa service\?'\)\) \{\s+await deleteVisaService\(id\);\s+setVisas\(visas\.filter\(v => v\.id !== id\)\);\s+\}\s+\}/,
  `const handleDeleteVisa = (id: string) => {
      confirmAction('Delete Visa Service', 'Are you sure you want to delete this visa service?', async () => {
          const toastId = toast.loading('Deleting...');
          try {
             await deleteVisaService(id);
             setVisas(visas.filter(v => v.id !== id));
             toast.success('Visa service deleted', { id: toastId });
          } catch(e) {
             toast.error('Failed to delete', { id: toastId });
          }
      });
  }`
);

// Replace handleDeleteDestination
content = content.replace(
  /const handleDeleteDestination = async \(id: string\) => \{\s+if\(window\.confirm\('Are you sure you want to delete this destination\?'\)\) \{\s+await deleteDestination\(id\);\s+setDestinations\(destinations\.filter\(d => d\.id !== id\)\);\s+\}\s+\}/,
  `const handleDeleteDestination = (id: string) => {
      confirmAction('Delete Destination', 'Are you sure you want to delete this destination?', async () => {
          const toastId = toast.loading('Deleting...');
          try {
             await deleteDestination(id);
             setDestinations(destinations.filter(d => d.id !== id));
             toast.success('Destination deleted', { id: toastId });
          } catch(e) {
             toast.error('Failed to delete', { id: toastId });
          }
      });
  }`
);

// Replace handleDeleteFlight
content = content.replace(
  /const handleDeleteFlight = async \(id: string\) => \{\s+if\(window\.confirm\('Are you sure you want to delete this flight\?'\)\) \{\s+await deleteAdminFlight\(id\);\s+setAdminFlights\(adminFlights\.filter\(f => f\.id !== id\)\);\s+\}\s+\}/,
  `const handleDeleteFlight = (id: string) => {
      confirmAction('Delete Flight', 'Are you sure you want to delete this flight?', async () => {
          const toastId = toast.loading('Deleting...');
          try {
             await deleteAdminFlight(id);
             setAdminFlights(adminFlights.filter(f => f.id !== id));
             toast.success('Flight deleted', { id: toastId });
          } catch(e) {
             toast.error('Failed to delete', { id: toastId });
          }
      });
  }`
);

// Replace the other delete calls (Job)
content = content.replace(
  /if\(window\.confirm\('Delete\?'\)\) \{\s+await deleteJob\(j\.id\);\s+setJobs\(jobs\.filter\(job => job\.id !== j\.id\)\);\s+\}/g,
  `confirmAction('Delete Job', 'Are you sure you want to delete this job?', async () => {
      const toastId = toast.loading('Deleting...');
      try {
          await deleteJob(j.id);
          setJobs(jobs.filter(job => job.id !== j.id));
          toast.success('Job deleted', { id: toastId });
      } catch(e) { toast.error('Failed', { id: toastId }); }
  });`
);

// Replace (PressRelease)
content = content.replace(
  /if\(window\.confirm\('Delete\?'\)\) \{\s+await deletePressRelease\(pr\.id\);\s+setPressReleases\(pressReleases\.filter\(p => p\.id !== pr\.id\)\);\s+\}/g,
  `confirmAction('Delete Press Release', 'Are you sure you want to delete this press release?', async () => {
      const toastId = toast.loading('Deleting...');
      try {
          await deletePressRelease(pr.id);
          setPressReleases(pressReleases.filter(p => p.id !== pr.id));
          toast.success('Press release deleted', { id: toastId });
      } catch(e) { toast.error('Failed', { id: toastId }); }
  });`
);

// Replace (BlogPost)
content = content.replace(
  /if\(window\.confirm\('Delete\?'\)\) \{\s+await deleteBlogPost\(bp\.id\);\s+setBlogPosts\(blogPosts\.filter\(b => b\.id !== bp\.id\)\);\s+\}/g,
  `confirmAction('Delete Blog Post', 'Are you sure you want to delete this blog post?', async () => {
      const toastId = toast.loading('Deleting...');
      try {
          await deleteBlogPost(bp.id);
          setBlogPosts(blogPosts.filter(b => b.id !== bp.id));
          toast.success('Blog post deleted', { id: toastId });
      } catch(e) { toast.error('Failed', { id: toastId }); }
  });`
);


content = content.replace(
  /if\(window\.confirm\(\`Make \$\{u\.email\} an admin\?\`\)\) \{\s+await updateUserRole\(u\.id, 'admin'\);\s+setUsersList\(usersList\.map\(usr => usr\.id === u\.id \? \{\.\.\.usr, role: 'admin'\} : usr\)\);\s+\}/g,
  `confirmAction('Make Admin', \`Make \${u.email} an admin?\`, async () => {
      const toastId = toast.loading('Updating...');
      try {
          await updateUserRole(u.id, 'admin');
          setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, role: 'admin'} : usr));
          toast.success('User updated', { id: toastId });
      } catch(e) { toast.error('Failed', { id: toastId }); }
  });`
);

content = content.replace(
  /if\(window\.confirm\(\`Remove admin privileges for \$\{u\.email\}\?\`\)\) \{\s+await updateUserRole\(u\.id, 'user'\);\s+setUsersList\(usersList\.map\(usr => usr\.id === u\.id \? \{\.\.\.usr, role: 'user'\} : usr\)\);\s+\}/g,
  `confirmAction('Revoke Admin', \`Remove admin privileges for \${u.email}?\`, async () => {
      const toastId = toast.loading('Updating...');
      try {
          await updateUserRole(u.id, 'user');
          setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, role: 'user'} : usr));
          toast.success('User updated', { id: toastId });
      } catch(e) { toast.error('Failed', { id: toastId }); }
  });`
);

// Replace save Support Channels alert -> toast
content = content.replace(
  /saveSupportChannels\(supportData\)\.then\(\(\) => alert\('Saved successfully!'\)\)\.catch\(e => alert\(e\.message\)\);/g,
  "toast.promise(saveSupportChannels(supportData), { loading: 'Saving...', success: 'Saved successfully!', error: 'Failed to save settings' });"
);

// Replace savePageData alert -> toast
content = content.replace(
  /savePageData\(selectedPageId, aboutUsData\)\.then\(\(\) => alert\('Saved!'\)\)\.catch\(e => alert\(e\.message\)\);/g,
  "toast.promise(savePageData(selectedPageId, aboutUsData), { loading: 'Saving...', success: 'Saved!', error: 'Failed to save' });"
);

// Image uploading alert -> toast
content = content.replace(
/alert\('Failed to upload image\.'\);/g,
"toast.error('Failed to upload image.');"
);
content = content.replace(
/alert\("Failed to upload image\. Please try again\."\);/g,
"toast.error('Failed to upload image. Please try again.');"
);

// Status update alert -> toast
content = content.replace(
  /alert\("Failed to update status"\);/g,
  "toast.error('Failed to update status');"
);

// Notes alert -> toast
content = content.replace(
  /alert\('Notes saved successfully'\);/g,
  "toast.success('Notes saved successfully');"
);
content = content.replace(
  /alert\('Failed to save notes'\);/g,
  "toast.error('Failed to save notes');"
);


// Replace form submit handling to add loading toast
content = content.replace(
  /const handleCreateSubmit = async \(\) => \{/g,
  `const handleCreateSubmit = async () => {\n        const toastId = toast.loading('Saving...');`
);

content = content.replace(
  /setModalOpen\(false\);\n    \} catch\(err\) \{/g,
  `setModalOpen(false);\n            toast.success('Saved successfully', { id: toastId });\n    } catch(err) {\n            toast.error('Failed to save', { id: toastId });`
);


// Add profile tab
content = content.replace(
  "{ id: 'users', label: 'User Management', icon: Users },",
  "{ id: 'users', label: 'User Management', icon: Users },\n      { id: 'profile', label: 'Admin Profile', icon: UserCircle },"
);


// Inject ConfirmDialog Provider at the root of the AdminDashboard render
content = content.replace(
  /<div className="min-h-screen bg-slate-50 flex font-sans">/,
  `<Toaster position="top-right" />\n    <div className="min-h-screen bg-slate-50 flex font-sans">\n      {confirmOptions && (\n        <ConfirmDialog \n          isOpen={confirmOptions.isOpen} \n          title={confirmOptions.title} \n          message={confirmOptions.message} \n          onConfirm={confirmOptions.onConfirm} \n          onCancel={() => setConfirmOptions(null)} \n        />\n      )}`
);

// Add TabType profile
content = content.replace(
  "type TabType = 'overview' | 'bookings' | 'flights' | 'destinations' | 'hotels' | 'holidays' | 'visa' | 'pages' | 'careers' | 'press' | 'blog' | 'users' | 'settings' | 'support_channels' | 'payment_methods';",
  "type TabType = 'overview' | 'bookings' | 'flights' | 'destinations' | 'hotels' | 'holidays' | 'visa' | 'pages' | 'careers' | 'press' | 'blog' | 'users' | 'settings' | 'support_channels' | 'payment_methods' | 'profile';"
);


fs.writeFileSync('pages/AdminDashboard.tsx', content);

console.log("Refactoring complete");
