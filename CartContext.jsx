import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBranch } from './BranchContext';

const CartContext = createContext(null);
const CART_STORAGE_PREFIX = 'zumrad_cart_';

export const CartProvider = ({ children }) => {
  const { selectedBranchId } = useBranch();
  const [cartsByBranch, setCartsByBranch] = useState(() => {
    try {
      const f1 = JSON.parse(localStorage.getItem(CART_STORAGE_PREFIX + 'filial-1') || '[]');
      const f2 = JSON.parse(localStorage.getItem(CART_STORAGE_PREFIX + 'filial-2') || '[]');
      return { 'filial-1': f1, 'filial-2': f2 };
    } catch {
      return { 'filial-1': [], 'filial-2': [] };
    }
  });

  // Current active cart items for current branch
  const currentBranchItems = cartsByBranch[selectedBranchId] || [];

  // Persist whenever cart updates
  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_PREFIX + 'filial-1',
      JSON.stringify(cartsByBranch['filial-1'] || [])
    );
    localStorage.setItem(
      CART_STORAGE_PREFIX + 'filial-2',
      JSON.stringify(cartsByBranch['filial-2'] || [])
    );
  }, [cartsByBranch]);

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    const branchId = product.branch_id || selectedBranchId;
    setCartsByBranch((prev) => {
      const branchCart = prev[branchId] ? [...prev[branchId]] : [];
      const itemKey = `${product.id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}`;

      const existingIndex = branchCart.findIndex(
        (item) => item.key === itemKey
      );

      if (existingIndex > -1) {
        branchCart[existingIndex].quantity += quantity;
      } else {
        branchCart.push({
          key: itemKey,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          branch_id: branchId,
        });
      }

      return {
        ...prev,
        [branchId]: branchCart,
      };
    });
  };

  const removeFromCart = (itemKey) => {
    setCartsByBranch((prev) => {
      const branchCart = (prev[selectedBranchId] || []).filter(
        (item) => item.key !== itemKey
      );
      return {
        ...prev,
        [selectedBranchId]: branchCart,
      };
    });
  };

  const updateQuantity = (itemKey, delta) => {
    setCartsByBranch((prev) => {
      const branchCart = (prev[selectedBranchId] || []).map((item) => {
        if (item.key === itemKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);

      return {
        ...prev,
        [selectedBranchId]: branchCart,
      };
    });
  };

  const clearCart = (branchId = selectedBranchId) => {
    setCartsByBranch((prev) => ({
      ...prev,
      [branchId]: [],
    }));
  };

  const totalCount = currentBranchItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = currentBranchItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: currentBranchItems,
        totalCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
