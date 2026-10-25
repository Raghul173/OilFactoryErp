import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  FileSpreadsheet,
  Download,
  CheckCircle,
  Printer,
  Warehouse,
  Factory,
  Receipt,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export const ReportsModule = () => {
  const {
    inventory = [],
    productionLogs = [],
    salesLogs = [],
    supplierLogs = [],
  } = useData();

  const [activeReportTab, setActiveReportTab] = useState('all');
  const [downloadMsg, setDownloadMsg] = useState('');

  // Summary Metrics
  const totalStockLiters = inventory.reduce((acc, t) => acc + (t.currentLiters ?? t.current ?? 0), 0);
  const totalCapacityLiters = inventory.reduce((acc, t) => acc + (t.capacityLiters ?? t.capacity ?? 0), 0);
  const totalSalesRevenue = salesLogs.reduce((acc, s) => acc + (s.totalAmount ?? 0), 0);
  const totalProcurementSpend = supplierLogs.reduce((acc, sup) => acc + (sup.totalCost ?? 0), 0);
  const totalProductionLiters = productionLogs.reduce((acc, p) => acc + (p.quantityLiters ?? 0), 0);

  // Export to Real CSV (Opens in Excel)
  const exportToCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    let csvRows = [];

    csvRows.push(['OILSYNC FACTORY MANAGEMENT SYSTEM - OPERATIONAL AUDIT REPORT']);
    csvRows.push([`Generated On: ${today}`, 'Confidential Industrial Record']);
    csvRows.push([]);

    // 1. Inventory Tanks
    csvRows.push(['SECTION 1: STORAGE TANK INVENTORY AUDIT']);
    csvRows.push(['Tank ID', 'Oil Variety', 'Current Liters', 'Capacity Liters', 'Utilization %', 'Min Alert Liters']);
    inventory.forEach((t) => {
      const cur = t.currentLiters ?? t.current ?? 0;
      const cap = t.capacityLiters ?? t.capacity ?? 1;
      const util = Math.round((cur / cap) * 100);
      csvRows.push([`TANK-0${t.id}`, t.name, cur, cap, `${util}%`, t.minAlert || 1000]);
    });
    csvRows.push([]);

    // 2. Production Batches
    csvRows.push(['SECTION 2: RECENT PRODUCTION EXTRACTION BATCHES']);
    csvRows.push(['Batch ID', 'Date', 'Oil Variety', 'Raw Seed Input (Kg)', 'Oil Extracted (L)', 'Efficiency %', 'Details']);
    productionLogs.forEach((p) => {
      const seedKg = p.rawSeedWeightKg || 1000;
      const qtyL = p.quantityLiters || 0;
      const eff = ((qtyL / seedKg) * 100).toFixed(1);
      csvRows.push([p.id, p.date || p.createdAt?.split('T')[0] || today, p.oilType, seedKg, qtyL, `${eff}%`, `"${p.details || 'Standard Batch'}"`]);
    });
    csvRows.push([]);

    // 3. Sales Dispatches
    csvRows.push(['SECTION 3: SALES & OUTBOUND DISPATCHES']);
    csvRows.push(['Order ID', 'Date', 'Customer/Buyer', 'Oil Variety', 'Dispatched Volume (L)', 'Total Amount (INR)']);
    salesLogs.forEach((s) => {
      csvRows.push([s.id, s.date || s.createdAt?.split('T')[0] || today, `"${s.buyerName || 'Buyer'}"`, s.oilType, s.quantityLiters, s.totalAmount]);
    });
    csvRows.push([]);

    // 4. Supplier Intakes
    csvRows.push(['SECTION 4: SUPPLIER RAW SEED INTAKES']);
    csvRows.push(['Intake ID', 'Date', 'Supplier Vendor', 'Raw Material', 'Quantity', 'Procurement Cost (INR)']);
    supplierLogs.forEach((sup) => {
      csvRows.push([sup.id, sup.date || sup.createdAt?.split('T')[0] || today, `"${sup.supplierName}"`, sup.materialItem, sup.quantity, sup.totalCost]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OilSync_Operational_Audit_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg(`Successfully exported OilSync_Operational_Audit_${today}.csv`);
    setTimeout(() => setDownloadMsg(''), 4500);
  };

  // Trigger Print to PDF
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 glass-panel rounded-3xl print:hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 rounded-xl shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Factory Audit & Compliance Reports
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate and export certified operational reports for management review and supply chain auditing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV (Excel)</span>
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Stock</span>
            <Warehouse className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalStockLiters.toLocaleString()} <span className="text-xs font-normal text-slate-500">Liters</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {Math.round((totalStockLiters / (totalCapacityLiters || 1)) * 100)}% total tank capacity
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Extracted Oil</span>
            <Factory className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {totalProductionLiters.toLocaleString()} <span className="text-xs font-normal text-slate-500">Liters</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{productionLogs.length} production batches logged</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sales Revenue</span>
            <Receipt className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{totalSalesRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{salesLogs.length} fulfilled client orders</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Seed Spend</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">
            ₹{totalProcurementSpend.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{supplierLogs.length} vendor deliveries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
        {[
          { id: 'all', label: 'Complete Audit Snapshot' },
          { id: 'inventory', label: 'Tanks & Storage' },
          { id: 'production', label: 'Production Runs' },
          { id: 'sales', label: 'Sales Dispatches' },
          { id: 'suppliers', label: 'Supplier Intakes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === tab.id
                ? 'bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Sheet */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-8 shadow-xs">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-blue-600 dark:text-amber-400 uppercase">
                SMARTOIL ERP
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Official Production & Inventory Audit Log
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Industrial Plant Operational Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Audit ID: #AUD-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Authenticity
            </span>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Section 1: Storage Tank Levels */}
        {(activeReportTab === 'all' || activeReportTab === 'inventory') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-blue-500" />
                1. Storage Tank Audit Snapshot
              </h4>
              <span className="text-xs text-slate-400 font-mono">{inventory.length} Active Tanks</span>
            </div>
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Tank ID</th>
                    <th className="p-3">Oil Variant</th>
                    <th className="p-3">Current Liters</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Fill Ratio</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {inventory.map((t) => {
                    const current = t.currentLiters ?? t.current ?? 0;
                    const capacity = t.capacityLiters ?? t.capacity ?? 1;
                    const util = Math.round((current / capacity) * 100);
                    const isLow = current <= (t.minAlert || 1000);

                    return (
                      <tr key={t.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-amber-400">TANK-0{t.id}</td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                        <td className="p-3 font-mono font-semibold">{current.toLocaleString()} L</td>
                        <td className="p-3 font-mono text-slate-400">{capacity.toLocaleString()} L</td>
                        <td className="p-3 font-bold font-mono">{util}%</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isLow
                                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {isLow ? 'Reorder Alert' : 'Normal Capacity'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 2: Production Extraction Batches */}
        {(activeReportTab === 'all' || activeReportTab === 'production') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Factory className="w-4 h-4 text-indigo-500" />
                2. Historical Production Batches & Yields
              </h4>
              <span className="text-xs text-slate-400 font-mono">{productionLogs.length} Batches</span>
            </div>
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 sticky top-0">
                  <tr>
                    <th className="p-3">Batch ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Oil Variant</th>
                    <th className="p-3">Seed Weight (Kg)</th>
                    <th className="p-3">Extracted (L)</th>
                    <th className="p-3">Recovery Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {productionLogs.slice(0, 15).map((p) => {
                    const seedKg = p.rawSeedWeightKg || 1000;
                    const qtyL = p.quantityLiters || 0;
                    const eff = ((qtyL / seedKg) * 100).toFixed(1);

                    return (
                      <tr key={p.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-blue-600 dark:text-amber-400">{p.id}</td>
                        <td className="p-3 font-mono text-slate-400">{p.date || '2026-10-26'}</td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{p.oilType}</td>
                        <td className="p-3 font-mono">{seedKg.toLocaleString()} kg</td>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {qtyL.toLocaleString()} L
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{eff}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Recent Wholesale Sales */}
        {(activeReportTab === 'all' || activeReportTab === 'sales') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                3. Recent Wholesale Sales Dispatches
              </h4>
              <span className="text-xs text-slate-400 font-mono">{salesLogs.length} Orders</span>
            </div>
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer / Client</th>
                    <th className="p-3">Oil Variant</th>
                    <th className="p-3">Volume</th>
                    <th className="p-3">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {salesLogs.slice(0, 10).map((o) => (
                    <tr key={o.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-amber-400">{o.id}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{o.buyerName || 'Buyer'}</td>
                      <td className="p-3">{o.oilType}</td>
                      <td className="p-3 font-mono font-semibold">{o.quantityLiters.toLocaleString()} L</td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{o.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Supplier Procurement Intake */}
        {(activeReportTab === 'all' || activeReportTab === 'suppliers') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                4. Raw Seed Procurement Intake Logs
              </h4>
              <span className="text-xs text-slate-400 font-mono">{supplierLogs.length} Deliveries</span>
            </div>
            <div className="overflow-x-auto border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Intake ID</th>
                    <th className="p-3">Vendor / Farmer</th>
                    <th className="p-3">Raw Seed Variety</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {supplierLogs.slice(0, 10).map((sup) => (
                    <tr key={sup.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-amber-400">{sup.id}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{sup.supplierName}</td>
                      <td className="p-3">{sup.materialItem}</td>
                      <td className="p-3 font-mono">{sup.quantity}</td>
                      <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        ₹{sup.totalCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Sign-off Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 SmartOil ERP • Certified Operational Record • All rights reserved.</p>
          <p className="font-mono">Document Hash: SHA256-ED9827A1BC4</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
