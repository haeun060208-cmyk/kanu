import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types/kanu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (capsuleId: string, delta: number) => void;
  onRemoveItem: (capsuleId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.capsule.price * item.quantity, 0);
  const freeShippingThreshold = 30000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shippingFee;
  const freeShippingGap = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const mockOrderId = `KANU-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderComplete(mockOrderId);
      setIsCheckingOut(false);
      onClearCart();
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-[#121316] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-lg font-bold text-white tracking-wide">장바구니 (Cart)</h2>
            <span className="text-xs text-zinc-400 font-mono">({cartItems.length})</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>무료 배송 혜택이 적용되었습니다! (3만원 이상)</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-1.5">
                <span>무료 배송까지</span>
                <span className="text-[#c5a059] font-semibold tabular-nums">
                  ₩{freeShippingGap.toLocaleString()} 남음
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c5a059] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">주문이 정상 접수되었습니다!</h3>
              <p className="text-xs text-zinc-400">
                주문번호: <strong className="text-white font-mono">{orderComplete}</strong>
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                카누 바리스타 정품 캡슐이 신선함을 가득 품고 곧 발송 준비될 예정입니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderComplete(null);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#c5a059] text-black font-semibold text-xs transition-colors"
              >
                쇼핑 계속하기
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-[1.2] opacity-40" />
              <p className="text-sm">장바구니가 비어 있습니다.</p>
              <p className="text-xs text-zinc-500">원하시는 캡슐을 골라 담아보세요.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.capsule.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/5"
              >
                {/* Capsule swatch indicator */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 shrink-0 shadow-sm"
                  style={{ backgroundColor: item.capsule.colorHex }}
                >
                  <span className="text-[10px] font-bold text-white/80 font-serif">K</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-400 font-mono">Lv.{item.capsule.intensity}</div>
                  <h4 className="text-sm font-semibold text-white truncate">{item.capsule.nameKo}</h4>
                  <div className="text-xs text-[#c5a059] font-mono tabular-nums font-medium">
                    ₩{(item.capsule.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-black/40 rounded-lg p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.capsule.id, -1)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono text-white px-1.5 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.capsule.id, 1)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.capsule.id)}
                  aria-label="상품 삭제"
                  className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Total */}
        {!orderComplete && cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/30 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center justify-between">
                <span>상품 금액</span>
                <span className="text-white font-mono tabular-nums">₩{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>배송비</span>
                <span className="text-white font-mono tabular-nums">
                  {shippingFee === 0 ? '무료' : `₩${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>총 결제금액</span>
                <span className="text-base text-[#c5a059] font-mono tabular-nums">
                  ₩{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d9b672] text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span>결제 처리 중...</span>
              ) : (
                <>
                  <span>간편 결제 진행하기</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>동서식품 공식 인증 정품 100% 보장</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
