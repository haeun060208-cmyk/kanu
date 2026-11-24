/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Capsule3DViewer } from './components/Capsule3DViewer';
import { MachineShowcase } from './components/MachineShowcase';
import { CapsuleCatalog } from './components/CapsuleCatalog';
import { BrandStory } from './components/BrandStory';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { KANU_CAPSULES } from './data/capsules';
import { CapsuleItem, CartItem } from './types/kanu';

export default function App() {
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleItem>(KANU_CAPSULES[0]);
  const [cart, setCart] = useState<CartItem[]>([
    { capsule: KANU_CAPSULES[0], quantity: 2 },
    { capsule: KANU_CAPSULES[1], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (capsule: CapsuleItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.capsule.id === capsule.id);
      if (existing) {
        return prev.map((item) =>
          item.capsule.id === capsule.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { capsule, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (capsuleId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.capsule.id === capsuleId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (capsuleId: string) => {
    setCart((prev) => prev.filter((item) => item.capsule.id !== capsuleId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Switch capsule in 3D Viewer with smooth scroll
  const handleSelectIn3D = (capsule: CapsuleItem) => {
    setSelectedCapsule(capsule);
    const viewerEl = document.getElementById('capsules-3d');
    viewerEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectByNav = (capsuleId: string) => {
    const target = KANU_CAPSULES.find((c) => c.id === capsuleId);
    if (target) {
      setSelectedCapsule(target);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f4f2ee] selection:bg-[#c5a059] selection:text-black">
      {/* Top Header with Strict 3-zone contract & Mobile Hamburger animation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCapsuleByNav={handleSelectByNav}
      />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* 3D Capsule Studio Section (User Requirement 2) */}
        <Capsule3DViewer
          selectedCapsule={selectedCapsule}
          onSelectCapsule={setSelectedCapsule}
          allCapsules={KANU_CAPSULES}
          onAddToCart={handleAddToCart}
        />

        {/* Barista Machine Showcase */}
        <MachineShowcase />

        {/* Capsule Catalog Section */}
        <CapsuleCatalog
          capsules={KANU_CAPSULES}
          onSelectIn3D={handleSelectIn3D}
          onAddToCart={handleAddToCart}
        />

        {/* Brand Story & Craftsmanship Section */}
        <BrandStory />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
