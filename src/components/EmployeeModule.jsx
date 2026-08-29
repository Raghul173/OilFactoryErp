import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Trash2, ShieldCheck, Mail, Check, Copy, Sparkles } from 'lucide-react';

export const EmployeeModule = () => {
  const { employees, addEmployee, removeEmployee, updateAttendance } = useData();
  const { user, registerNewCredentials } = useAuth();
  const isAdmin = user?.role === 'Administrator';

  // Entry Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Factory Staff');
  const [dept, setDept] = useState('Refining Operations');
  const [shift, setShift] = useState('Morning (06:00 - 14:00)');
  const [allocatedMachine, setAllocatedMachine] = useState('Refinery Line B');

  // Issued Credentials Card Modal State
  const [issuedCreds, setIssuedCreds] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    // Generate unique credentials
    const cleanName = name.replace(/[^a-zA-Z]/g, '');
    const prefix = role === 'Factory Manager' ? 'MGR' : 'EMP';
    const generatedUsername = `${prefix}_${cleanName}`;
    const generatedPassword = `OilSync@${Math.floor(1000 + Math.random() * 9000)}`;

    const newMemberData = {
      name,
      email,
      username: generatedUsername,
      password: generatedPassword,
      role,
      dept,
      shift,
      allocatedMachine
    };

    // Register in Auth Context accounts pool
    registerNewCredentials(newMemberData);

    // Register in Data Context roster
    addEmployee(newMemberData);

    // Show Issued Login Credentials Pass
    setIssuedCreds(newMemberData);

    // Reset Form
    setName('');
    setEmail('');
    setShowModal(false);
  };

  const copyToClipboard = () => {
    if (!issuedCreds) return;
    const text = `OilSync ERP Login Credentials:\nRole: ${issuedCreds.role}\nUsername: ${issuedCreds.username}\nPassword: ${issuedCreds.password}\nGmail: ${issuedCreds.email}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const presentCount = employees.filter(e => e.attendance === 'Present').length;
  const leaveCount = employees.filter(e => e.attendance === 'On Leave' || e.attendance === 'Absent').length;
  const managerCount = employees.filter(e => e.role === 'Factory Manager').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-amber-500/10 text-blue-700 dark:text-amber-400">
              {isAdmin ? 'Admin Exclusive Control Section' : 'Staff Roster View'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-amber-400" />
            Employee & Manager Roster Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Admit new managers and staff, generate dynamic login credentials, and manage roster.'
              : 'Shift assignments, department rosters, and machinery allocations.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit & Issue New Login Credentials</span>
          </button>
        )}
      </div>

      {/* Roster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 glass-card rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Personnel</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{employees.length}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active Factory Roster</p>
        </div>

        <div className="p-4 glass-card rounded-2xl">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Present Today</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">{presentCount}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Checked In & Active</p>
        </div>

        <div className="p-4 glass-card rounded-2xl">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Absences / On Leave</span>
          <h3 className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">{leaveCount}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Pending Shift Return</p>
        </div>

        <div className="p-4 glass-card rounded-2xl">
          <span className="text-xs font-semibold text-indigo-600 dark:text-purple-400 uppercase">Factory Managers</span>
          <h3 className="text-2xl font-extrabold text-indigo-700 dark:text-purple-400 mt-1">{managerCount}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Operations Supervisory</p>
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employees.map((emp) => {
          const isManager = emp.role === 'Factory Manager';

          return (
            <div
              key={emp.id}
              className={`p-5 glass-card rounded-2xl border flex flex-col justify-between transition-all ${isManager ? 'border-indigo-200 dark:border-purple-500/30 bg-indigo-50/20 dark:bg-purple-950/20' : 'border-slate-200 dark:border-slate-800'
                }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isManager ? 'bg-indigo-100 dark:bg-purple-500/20 text-indigo-700 dark:text-purple-300' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                      {isManager ? <ShieldCheck className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {emp.name}
                        {isManager && (
                          <span className="text-[10px] bg-indigo-100 dark:bg-purple-500/20 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                            Manager
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {emp.email}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => removeEmployee(emp.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove Member from Roster"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Department</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{emp.dept}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Shift Timing</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{emp.shift}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Allocated Unit</span>
                    <span className="text-blue-700 dark:text-amber-400 font-mono font-semibold">{emp.allocatedMachine}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Attendance Status</span>
                    {isAdmin ? (
                      <select
                        value={emp.attendance}
                        onChange={(e) => updateAttendance(emp.id, e.target.value)}
                        className="mt-0.5 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="Present">Present</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      <span className={`inline-block mt-1 font-bold ${emp.attendance === 'Present' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {emp.attendance}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 text-[10px] text-slate-400 flex justify-between border-t border-slate-50 dark:border-slate-800/60">
                <span>Member ID: {emp.id}</span>
                <span>Username: <strong className="font-mono text-slate-600 dark:text-slate-300">{emp.username || emp.id}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Admission Form Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              Admit Personnel & Generate Login Credentials
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Entering new staff or manager details will auto-generate secure login credentials.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@gmail.com"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Role Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="Factory Staff">Factory Staff</option>
                  <option value="Factory Manager">Factory Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Shift Timing</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                  <option value="General Shift (08:00 - 17:00)">General Shift (08:00 - 17:00)</option>
                  <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                  <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">Allocated Unit / Machinery</label>
                <input
                  type="text"
                  value={allocatedMachine}
                  onChange={(e) => setAllocatedMachine(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md">
                  Generate Logins & Admit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newly Issued Credentials Card Modal */}
      {issuedCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-amber-500/20 text-blue-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-amber-400 tracking-wider">New Entry Processed</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generated Login Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Please hand over these credentials to <strong>{issuedCreds.name}</strong>.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Role:</span>
                <span className="font-bold text-blue-700 dark:text-amber-400 font-sans">{issuedCreds.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Username:</span>
                <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{issuedCreds.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Password:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{issuedCreds.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Gmail:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{issuedCreds.email}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>

              <button
                onClick={() => setIssuedCreds(null)}
                className="flex-1 py-2.5 bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Done & Issue Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
