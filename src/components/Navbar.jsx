import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { LogOut, Droplets, Sun, Moon, UserCheck, Edit3, Bell, AlertTriangle, Camera, Upload, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lowStockAlerts, isLiveConnected } = useData();

  // Notification Modal State
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Operations');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Preset avatar choices
  const presetAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile({ name, email, department, avatar });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowEditModal(false);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors duration-300 font-sans">
      {/* Brand & System Title - Neat Modern Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-amber-500 dark:to-amber-600 rounded-2xl shadow-md shadow-blue-600/20 dark:shadow-amber-500/20 text-white dark:text-slate-950">
          <Droplets className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              OilSync <span className="text-blue-600 dark:text-amber-400">ERP</span>
            </h1>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase mt-0.5 hidden sm:block">
            Factory Operations Platform
          </p>
        </div>
      </div>

      {/* Controls, Notifications, Theme Switcher & Profile Actions */}
      <div className="flex items-center gap-3 relative">
        {/* Live Cloud Connection Status Badge */}
        <div
          title={isLiveConnected ? 'Connected to Live MySQL & Socket.io Server' : 'Operating in Local Mode'}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
            isLiveConnected
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
          <span className={`w-2 h-2 rounded-full -ml-3.5 ${isLiveConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span>{isLiveConnected ? 'Live Cloud Sync' : 'Local Mode'}</span>
        </div>

        {/* Low Stock Notifications Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-all font-semibold cursor-pointer flex items-center justify-center"
            title="Low Stock Notifications"
          >
            <Bell className="w-4 h-4" />
            {lowStockAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-md">
                {lowStockAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Inventory Threshold Alerts
                </h3>
                <span className="text-[10px] bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                  {lowStockAlerts.length} Low Stock
                </span>
              </div>

              {lowStockAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  All oil varieties are sufficiently stocked above minimum levels.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {lowStockAlerts.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                          Current: <strong>{item.currentLiters}L</strong> (Min: {item.minAlert}L)
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-rose-500 text-white rounded-lg shadow-xs">
                        Refill Required
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Mode Switcher Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 transition-all font-semibold cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* User Identity & Active Role Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            {/* Clickable Profile Card Trigger */}
            <button
              onClick={() => {
                setName(user.name);
                setEmail(user.email);
                setDepartment(user.department || 'Operations');
                setAvatar(user.avatar || '');
                setShowEditModal(true);
              }}
              className="flex items-center gap-2.5 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-left cursor-pointer group"
              title="Click to edit your profile photo and details"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-blue-200 dark:border-amber-500/30 object-cover shadow-xs"
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 p-0.5 rounded-full shadow-xs">
                  <Edit3 className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                    {user.name}
                  </span>
                  <span className="text-[10px] bg-blue-600 dark:bg-amber-500/10 dark:border dark:border-amber-500/30 text-white dark:text-amber-400 px-2 py-0.5 rounded-full font-bold shadow-xs">
                    {user.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[160px]">{user.email}</p>
              </div>
            </button>

            {/* Logout Action Button WITH EXPLICIT TEXT LABEL */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Sign Out of Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Editing Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <img
                  src={avatar || user.avatar}
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-full border-2 border-blue-600 dark:border-amber-500 object-cover shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update display photo, name, email & department</p>
              </div>
            </div>

            {savedNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Profile photo & details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1.5">
                  Change Profile Photo
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
                      <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                      <span>Upload Photo from Device</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
                    <div className="flex gap-2">
                      {presetAvatars.map((url, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAvatar(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            avatar === url ? 'border-blue-600 dark:border-amber-500 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Department / Unit
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
