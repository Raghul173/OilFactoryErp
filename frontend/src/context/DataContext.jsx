import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  inventoryService,
  productionService,
  salesService,
  supplierService,
  employeeService
} from '../services/api';
import { getSocket } from '../services/socket';

const DataContext = createContext();

const INITIAL_INVENTORY = [
  { id: 1, name: 'Groundnut Oil', currentLiters: 0, capacityLiters: 10000, minAlert: 1000 },
  { id: 2, name: 'Sunflower Oil', currentLiters: 0, capacityLiters: 8000, minAlert: 800 },
  { id: 3, name: 'Mustard Oil', currentLiters: 0, capacityLiters: 6000, minAlert: 500 },
  { id: 4, name: 'Sesame Oil', currentLiters: 0, capacityLiters: 5000, minAlert: 400 },
  { id: 5, name: 'Coconut Oil', currentLiters: 0, capacityLiters: 7000, minAlert: 1000 },
];

const INITIAL_PRODUCTION = [];
const INITIAL_SUPPLIERS = [];
const INITIAL_SALES = [];
const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-01',
    name: 'Raghul (Administrator)',
    role: 'Administrator',
    email: 'raghuluma2006@gmail.com'
  }
];

export const DataProvider = ({ children }) => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [productionLogs, setProductionLogs] = useState(INITIAL_PRODUCTION);
  const [supplierLogs, setSupplierLogs] = useState(INITIAL_SUPPLIERS);
  const [salesLogs, setSalesLogs] = useState(INITIAL_SALES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Low Stock Items Filter
  const lowStockAlerts = inventory.filter(item => item.currentLiters <= item.minAlert);

  // Fetch initial data from backend API
  const refreshAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [invRes, prodRes, salesRes, supRes, empRes] = await Promise.allSettled([
        inventoryService.getInventory(),
        productionService.getLogs(),
        salesService.getLogs(),
        supplierService.getLogs(),
        employeeService.getEmployees()
      ]);

      if (invRes.status === 'fulfilled' && invRes.value.data?.inventory?.length > 0) {
        setInventory(invRes.value.data.inventory);
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.data?.logs?.length > 0) {
        setProductionLogs(prodRes.value.data.logs);
      }
      if (salesRes.status === 'fulfilled' && salesRes.value.data?.logs?.length > 0) {
        setSalesLogs(salesRes.value.data.logs);
      }
      if (supRes.status === 'fulfilled' && supRes.value.data?.logs?.length > 0) {
        setSupplierLogs(supRes.value.data.logs);
      }
      if (empRes.status === 'fulfilled' && empRes.value.data?.employees?.length > 0) {
        setEmployees(empRes.value.data.employees);
      }
    } catch (error) {
      console.warn('API sync fallback to local mode:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Real-Time Socket.io Synchronization
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setIsLiveConnected(true);
      refreshAllData();
    };

    const handleDisconnect = () => {
      setIsLiveConnected(false);
    };

    const handleInventorySync = (data) => {
      if (data?.inventory) {
        setInventory(data.inventory);
      }
    };

    const handleInventoryUpdated = (data) => {
      if (data?.item) {
        setInventory(prev => prev.map(inv => inv.id === data.item.id ? data.item : inv));
      }
    };

    const handleProductionAdded = (data) => {
      if (data?.batch) {
        setProductionLogs(prev => {
          if (prev.some(b => b.id === data.batch.id)) return prev;
          return [data.batch, ...prev];
        });
      }
    };

    const handleSalesAdded = (data) => {
      if (data?.sale) {
        setSalesLogs(prev => {
          if (prev.some(s => s.id === data.sale.id)) return prev;
          return [data.sale, ...prev];
        });
      }
    };

    const handleSupplierAdded = (data) => {
      if (data?.intake) {
        setSupplierLogs(prev => {
          if (prev.some(sup => sup.id === data.intake.id)) return prev;
          return [data.intake, ...prev];
        });
      }
    };

    const handleEmployeeAdded = (data) => {
      if (data?.employee) {
        setEmployees(prev => {
          if (prev.some(e => e.id === data.employee.id || e.email === data.employee.email)) return prev;
          return [...prev, data.employee];
        });
      }
    };

    const handleEmployeeRemoved = (data) => {
      if (data?.id) {
        setEmployees(prev => prev.filter(e => e.id !== data.id && e.rawId !== data.id));
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('inventory:sync', handleInventorySync);
    socket.on('inventory:updated', handleInventoryUpdated);
    socket.on('production:added', handleProductionAdded);
    socket.on('sales:added', handleSalesAdded);
    socket.on('supplier:added', handleSupplierAdded);
    socket.on('employee:added', handleEmployeeAdded);
    socket.on('employee:removed', handleEmployeeRemoved);

    if (socket.connected) {
      setIsLiveConnected(true);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('inventory:sync', handleInventorySync);
      socket.off('inventory:updated', handleInventoryUpdated);
      socket.off('production:added', handleProductionAdded);
      socket.off('sales:added', handleSalesAdded);
      socket.off('supplier:added', handleSupplierAdded);
      socket.off('employee:added', handleEmployeeAdded);
      socket.off('employee:removed', handleEmployeeRemoved);
    };
  }, [refreshAllData]);

  // Action: Add Production Entry & Automatically Increase Inventory Stock
  const addProduction = async ({ oilType, quantityLiters, rawSeedWeightKg, details }) => {
    const qty = Number(quantityLiters);
    const seedKg = Number(rawSeedWeightKg) > 0 ? Number(rawSeedWeightKg) : Math.round(qty * 2.35);
    const batchId = `BATCH-${Math.floor(100 + Math.random() * 900)}`;

    const newEntry = {
      id: batchId,
      oilType,
      rawSeedWeightKg: seedKg,
      quantityLiters: qty,
      details: details || 'Standard Extraction Batch',
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Optimistic Local State Update
    setProductionLogs(prev => [newEntry, ...prev]);
    setInventory(prev => prev.map(item => {
      if (item.name === oilType) {
        return {
          ...item,
          currentLiters: Math.min(item.capacityLiters, item.currentLiters + qty)
        };
      }
      return item;
    }));

    // 2. Call Backend API
    try {
      await productionService.addBatch({ oilType, quantityLiters: qty, rawSeedWeightKg: seedKg, details });
    } catch (err) {
      console.warn('Backend production batch sync error (kept local state):', err.message);
    }
  };

  // Action: Add Sales Entry & Automatically Deduct Inventory Stock
  const addSale = async ({ orderType, buyerName, oilType, quantityLiters, totalAmount }) => {
    const qty = Number(quantityLiters);
    const amt = Number(totalAmount);

    const currentTank = inventory.find(i => i.name === oilType);
    const availableLiters = currentTank ? (currentTank.currentLiters ?? currentTank.current ?? 0) : 0;
    if (availableLiters < qty) {
      throw new Error(`Insufficient inventory for ${oilType}. Current stock is ${availableLiters}L, but ${qty}L was requested.`);
    }

    try {
      const res = await salesService.addSale({ orderType, buyerName, oilType, quantityLiters: qty, totalAmount: amt });
      if (res.data?.sale) {
        setSalesLogs(prev => {
          if (prev.some(s => s.id === res.data.sale.id)) return prev;
          return [res.data.sale, ...prev];
        });
      }
      if (res.data?.updatedInventory) {
        setInventory(prev => prev.map(item => item.name === oilType ? res.data.updatedInventory : item));
      }
      return res.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // Offline fallback only if stock validation passed
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const offlineSale = {
        id: orderId,
        orderType,
        buyerName,
        oilType,
        quantityLiters: qty,
        totalAmount: amt,
        date: new Date().toISOString().split('T')[0]
      };
      setSalesLogs(prev => [offlineSale, ...prev]);
      setInventory(prev => prev.map(item => {
        if (item.name === oilType) {
          return {
            ...item,
            currentLiters: Math.max(0, (item.currentLiters ?? item.current ?? 0) - qty)
          };
        }
        return item;
      }));
    }
  };

  // Action: Add Supplier Purchase Intake
  const addSupplier = async ({ supplierName, materialItem, quantity, totalCost }) => {
    const supId = `SUP-0${supplierLogs.length + 1}`;
    const newSupplier = {
      id: supId,
      supplierName,
      materialItem,
      quantity,
      totalCost: Number(totalCost),
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Optimistic Local State Update
    setSupplierLogs(prev => [newSupplier, ...prev]);

    // 2. Call Backend API
    try {
      await supplierService.addIntake({ supplierName, materialItem, quantity, totalCost });
    } catch (err) {
      console.warn('Backend supplier sync error:', err.message);
    }
  };

  // Action: Add Employee
  const addEmployee = async (member) => {
    const empId = `EMP-0${employees.length + 1}`;
    const newEmp = { id: empId, ...member };

    // 1. Optimistic Local State Update
    setEmployees(prev => [...prev, newEmp]);

    // 2. Call Backend API
    try {
      await employeeService.addEmployee(member);
    } catch (err) {
      console.warn('Backend add employee sync error:', err.message);
    }
  };

  // Action: Remove Employee
  const removeEmployee = async (id) => {
    // 1. Optimistic Local State Update
    setEmployees(prev => prev.filter(e => e.id !== id && e.rawId !== id));

    // 2. Call Backend API
    try {
      await employeeService.removeEmployee(id);
    } catch (err) {
      console.warn('Backend remove employee sync error:', err.message);
    }
  };

  // Action: Update Employee Attendance
  const updateAttendance = (id, attendance) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id || emp.rawId === id) ? { ...emp, attendance } : emp)
    );
  };

  return (
    <DataContext.Provider value={{
      inventory,
      lowStockAlerts,
      productionLogs,
      supplierLogs,
      salesLogs,
      employees,
      isLiveConnected,
      isLoading,
      refreshAllData,
      addProduction,
      addSale,
      addSupplier,
      addEmployee,
      removeEmployee,
      updateAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
