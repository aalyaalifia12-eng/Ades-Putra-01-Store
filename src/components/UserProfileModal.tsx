'use client';

import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Crown,
  Coins,
  Phone,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  Sparkles,
  LogOut,
  Save,
} from 'lucide-react';
import { User } from '@/types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  onOpenVipModal: () => void;
}

const AVATAR_PRESETS = [
  {
    name: 'Hijab Chic',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kasual Modern',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pria Sporty',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fashionista',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pria Urban',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
];

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenVipModal,
}: UserProfileModalProps) {
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser.avatar_url || AVATAR_PRESETS[0].url
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name,
      phone,
      email,
      address,
      avatar_url: avatarUrl,
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          setShowAvatarPicker(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header with gradient banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-zinc-900 to-red-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800">
                Profil Member
              </span>
              <span className="text-xs text-zinc-400">&bull; Ades Store 01</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Avatar & Identity Header */}
          <div className="flex items-center space-x-4 pt-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg bg-zinc-800">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md border-2 border-slate-900 transition-transform group-hover:scale-110"
                title="Ganti Foto Profil"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {name || 'Pelanggan Ades'}
                </h3>
                {currentUser.isVip ? (
                  <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                    <Crown className="w-2.5 h-2.5" />
                    <span>VIP</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-200">
                    <UserIcon className="w-2.5 h-2.5" />
                    <span>Reguler</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300 truncate mt-0.5">{email}</p>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{phone}</p>
            </div>
          </div>
        </div>

        {/* Avatar Picker Drawer (Dropdown) */}
        {showAvatarPicker && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5 animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Pilih Foto Avatar Cepat:
              </span>
              <label className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer underline flex items-center space-x-1">
                <span>Upload dari HP/Laptop</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhoto}
                  className="hidden"
                />
              </label>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(preset.url);
                    setShowAvatarPicker(false);
                  }}
                  className={`flex flex-col items-center p-1 rounded-xl border transition-all ${
                    avatarUrl === preset.url
                      ? 'border-red-600 bg-red-50 ring-2 ring-red-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="text-[9px] font-semibold text-slate-600 mt-1 truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Member Card & Coin Balance (10% Cashback benefit) */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              currentUser.isVip
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-red-500/10 border-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🪙</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Saldo Koin Belanja
                  </span>
                  <p className="text-lg font-black text-slate-900">
                    {currentUser.memberPoints.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-semibold text-slate-500">
                      Poin (Setara Rp {currentUser.memberPoints.toLocaleString('id-ID')})
                    </span>
                  </p>
                </div>
              </div>

              {currentUser.isVip ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-black text-[10px] uppercase shadow-xs">
                  ⚡ Cashback 10% Aktif
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVipModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-xs shadow-xs hover:from-amber-600 hover:to-red-700 transition-all flex items-center space-x-1"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-200" />
                  <span>Aktivasi VIP</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-200/60 pt-2 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>
                {currentUser.isVip
                  ? 'Sebagai VIP, Anda otomatis mendapat Cashback 10% koin di setiap pembelian produk sepatu, sandal & tas!'
                  : 'Daftar VIP sekarang untuk mendapatkan cashback 10% koin belanja dan ekstra diskon khusus!'}
              </span>
            </p>
          </div>

          {/* Form Detail Profil */}
          <form onSubmit={handleSave} className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Informasi Data Diri &amp; Pengiriman
            </h4>

            {/* Nama Lengkap */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Nama Lengkap:
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* WhatsApp / HP */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Nomor WhatsApp:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Alamat Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Alamat Pengiriman Utama */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Alamat Pengiriman Utama (Autofill saat Checkout):
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Mawar No. 12, RT 01/RW 02, Kel. Sukamaju, Kec. Sleman, D.I. Yogyakarta"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {isSaved && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Profil dan alamat berhasil disimpan!</span>
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </form>
        </div>

        {/* Footer with Logout Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">
            Ades Store 01 &bull; Akun Terverifikasi
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
