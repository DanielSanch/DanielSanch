'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@/lib/ThemeContext';

interface LoyaltyCardPreviewProps {
  cardName: string;
  businessName: string;
  clientName: string;
  type: 'stamps' | 'points' | 'visits' | 'event';
  requiredCount: number;
  currentCount: number;
  color: string;
  reward: string;
  cardId?: string;
  isRegistered?: boolean;
}

export default function LoyaltyCardPreview({
  cardName,
  businessName,
  clientName,
  type,
  requiredCount,
  currentCount,
  color,
  reward,
  cardId,
  isRegistered,
}: LoyaltyCardPreviewProps) {
  const { theme } = useTheme();

  const renderStamps = () => {
    const stamps = [];
    for (let i = 0; i < requiredCount; i++) {
      stamps.push(
        <div
          key={i}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < currentCount
              ? 'animate-stamp'
              : 'border-2 border-dashed opacity-40'
          }`}
          style={{
            backgroundColor: i < currentCount ? 'rgba(0,0,0,0.25)' : 'transparent',
            borderColor: i >= currentCount ? 'rgba(0,0,0,0.3)' : 'transparent',
            color: i < currentCount ? color : 'rgba(0,0,0,0.3)',
          }}
        >
          {i < currentCount ? '★' : i + 1}
        </div>
      );
    }
    return stamps;
  };

  const renderProgress = () => {
    const pct = Math.min((currentCount / requiredCount) * 100, 100);
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1 opacity-70">
          <span>{currentCount} / {requiredCount} {type === 'points' ? 'puntos' : 'visitas'}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-black/20">
          <div
            className="h-full rounded-full transition-all duration-500 bg-black/30"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`relative overflow-hidden ${isRegistered ? 'animate-torn' : ''}`}>
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[20px] border-white/20" />
          <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full border-[15px] border-white/20" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium opacity-70">
                {type === 'event' ? 'Entrada' : 'Tarjeta de Lealtad'}
              </p>
              <p className="font-bold text-lg">{cardName || 'Nombre de la tarjeta'}</p>
              <p className="text-xs opacity-80">{businessName || 'Tu Negocio'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="font-black text-sm">B</span>
            </div>
          </div>

          {/* Client name */}
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-wider opacity-60">Cliente</p>
            <p className="font-semibold text-sm">{clientName || 'Nombre del cliente'}</p>
          </div>

          {/* Type-specific content */}
          {type === 'stamps' && (
            <div className="flex flex-wrap gap-1.5">
              {renderStamps()}
            </div>
          )}
          {(type === 'points' || type === 'visits') && renderProgress()}
          {type === 'event' && (
            <div className={`text-center py-2 rounded-lg ${
              isRegistered ? 'bg-white/30' : 'bg-white/15'
            }`}>
              <p className="font-bold text-sm">
                {isRegistered ? 'REGISTRADO' : 'ENTRADA VÁLIDA'}
              </p>
            </div>
          )}

          {/* Reward */}
          {reward && (
            <p className="text-xs mt-3 opacity-80">
              Recompensa: {reward}
            </p>
          )}

          {/* QR Code */}
          {cardId && (
            <div className="flex justify-center mt-4">
              <div className="bg-white rounded-xl p-2">
                <QRCodeSVG
                  value={`berlin-wallet:${cardId}`}
                  size={80}
                  level="M"
                  fgColor={color}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
