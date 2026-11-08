import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataService, INITIAL_BRANCHES } from '../services/dataService';

const BranchContext = createContext(null);
const STORAGE_KEY = 'zumrad_selected_branch';

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState(() => DataService.getBranches());
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Refresh branches if updated
  useEffect(() => {
    setBranches(DataService.getBranches());
  }, []);

  // Handle URL route synchronization: /filial-1 or /filial-2
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.startsWith('/filial-1')) {
      if (selectedBranchId !== 'filial-1') {
        setSelectedBranchId('filial-1');
        localStorage.setItem(STORAGE_KEY, 'filial-1');
      }
    } else if (path.startsWith('/filial-2')) {
      if (selectedBranchId !== 'filial-2') {
        setSelectedBranchId('filial-2');
        localStorage.setItem(STORAGE_KEY, 'filial-2');
      }
    } else if (!selectedBranchId && !path.startsWith('/admin')) {
      // First visit modal on non-admin routes
      setIsModalOpen(true);
    }
  }, [location.pathname, selectedBranchId]);

  const selectBranch = (branchId, redirectToPath = null) => {
    setSelectedBranchId(branchId);
    localStorage.setItem(STORAGE_KEY, branchId);
    setIsModalOpen(false);

    if (redirectToPath) {
      navigate(redirectToPath);
    }
  };

  const activeBranch = selectedBranchId
    ? branches.find((b) => b.id === selectedBranchId) || branches[0]
    : branches[0];

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranchId: selectedBranchId || 'filial-1',
        isChosen: Boolean(selectedBranchId),
        activeBranch,
        selectBranch,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
