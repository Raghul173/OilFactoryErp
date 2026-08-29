import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Factory, Plus, CheckCircle2 } from 'lucide-react';
import { FlowAnalytics } from './FlowAnalytics';

export const ProductionModule = () => {
  const { inventory, productionLogs, addProduction } = useData();

  const [oilType, setOilType] = useState('Groundnut Oil');
  const [quantityLiters, setQuantityLiters] = useState('');
  const [details, setDetails] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantityLiters || Number(quantityLiters) <= 0) return;

    addProduction({
      oilType,
      quantityLiters: Number(quantityLiters),
      details: details || `${oilType} Production Entry`
    });

    setSuccessMsg(`Success! Added ${quantityLiters} Liters of ${oilType} to Inventory.`);
    setQuantityLiters('');
    setDetails('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Pie Chart Data: Production Volume Share by Category
  const categoryProductionMap = {};
  productionLogs.forEach(log => {
    categoryProductionMap[log.oilType] = (categoryProductionMap[log.oilType] || 0) + log.quantityLiters;
  });

  const pieChartData = Object.keys(categoryProductionMap).map(type => ({
    name: type,
    value: categoryProductionMap[type]
  }));

  // Bar Flow Data: Batch Volume Flow Breakdown
  const barChartData = productionLogs.map(log => ({
    name: log.id,
    quantity: log.quantityLiters
  }));

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="p-6 glass-panel rounded-3xl">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Factory className="w-6 h-6 text-blue-600 dark:text-amber-400" />
          Production Flow
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Factory staff entry form for produced oil quantities. Stock updates in inventory automatically.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Direct Entry Form */}
      <div className="p-6 glass-panel rounded-3xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Record New Oil Production Batch</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Oil Category
            </label>
            <select
              value={oilType}
              onChange={(e) => setOilType(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Quantity Produced (Liters)
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantityLiters}
              onChange={(e) => setQuantityLiters(e.target.value)}
              placeholder="e.g. 500"
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Batch Details / Notes
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Morning Shift Pressing"
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Batch & Update Inventory</span>
            </button>
          </div>
        </form>
      </div>

      {/* Production History Table */}
      <div className="p-6 glass-panel rounded-3xl overflow-x-auto">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Production Logs History</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">Batch Code</th>
              <th className="py-3 px-4">Oil Category</th>
              <th className="py-3 px-4">Quantity Produced</th>
              <th className="py-3 px-4">Batch Details</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {productionLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-700 dark:text-amber-400">{log.id}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">{log.oilType}</td>
                <td className="py-3.5 px-4 font-extrabold text-emerald-700 dark:text-emerald-400">+{log.quantityLiters.toLocaleString()} Liters</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{log.details}</td>
                <td className="py-3.5 px-4 text-slate-400 font-mono">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* High-End Analytics Section AT THE VERY BOTTOM */}
      <FlowAnalytics
        title="Production Analytics & Batch Flow"
        subtitle="Distribution of produced oil categories and batch output trends"
        pieData={pieChartData}
        barData={barChartData}
        pieValueKey="value"
        barValueKey="quantity"
        barXKey="name"
        unit="Liters"
      />
    </div>
  );
};
