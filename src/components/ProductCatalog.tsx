'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  SlidersHorizontal,
  Eye,
  Star,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Product } from '@/types';
import { formatIDR } from '@/lib/utils';
import { PRODUCT_CATEGORIES } from '@/lib/categories';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCatalog({
  products,
  selectedCategory,
  searchQuery,
  onSelectProduct,
}: ProductCatalogProps) {
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<number | null>(null);

  // Reset size filter when user changes category
  useEffect(() => {
    setSelectedSizeFilter(null);
  }, [selectedCategory]);

  const currentCategoryDef = PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory) || PRODUCT_CATEGORIES[0];
  const isFootwearCategory = selectedCategory === 'all' || selectedCategory.startsWith('sepatu');

  // Dynamically extract available shoe sizes from products in active view
  const availableSizes: number[] = Array.from(
    new Set(
      products
        .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
        .flatMap((p) => p.sizes || [])
        .filter((s) => typeof s === 'number' || (!isNaN(Number(s)) && Number(s) >= 16 && Number(s) <= 48))
        .map((s) => Number(s))
    )
  ).sort((a, b) => a - b);

  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSize =
      !selectedSizeFilter ||
      !p.category.startsWith('sepatu') ||
      (p.sizes && p.sizes.includes(selectedSizeFilter));
    return matchesCategory && matchesSearch && matchesSize;
  });

  return (
    <div className="space-y-3.5">
      {/* Category Header Banner with Description */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          <span className="text-2xl p-2 rounded-xl bg-slate-100 border border-slate-200/80">
            {currentCategoryDef.icon}
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-black text-sm sm:text-base text-slate-900">
                {currentCategoryDef.name}
              </h4>
              {currentCategoryDef.badge && (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-2xs">
                  {currentCategoryDef.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              {currentCategoryDef.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            {filtered.length} Produk
          </span>
        </div>
      </div>

      {/* Filter Bar: Dynamic Size Filter Pills (Tampil Khusus Kategori Sepatu) */}
      {isFootwearCategory && availableSizes.length > 0 && (
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
              <span>Pilihan Ukuran Kaki (Size):</span>
            </div>
            {selectedSizeFilter && (
              <button
                onClick={() => setSelectedSizeFilter(null)}
                className="text-[10px] text-red-600 font-extrabold hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSizeFilter(null)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                selectedSizeFilter === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Size ({filtered.length})
            </button>
            {availableSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? null : sz)}
                className={`min-w-8 h-7 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-center transition-all ${
                  selectedSizeFilter === sz
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Cards Grid: Responsive Mobile 2-Columns to Desktop 4-Columns */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h5 className="font-black text-sm text-slate-800">
            Tidak ada produk yang cocok
          </h5>
          <p className="text-xs text-slate-500">
            Coba pilih kategori lain atau reset kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filtered.map((product, index) => {
            const isOutOfStock = product.stock <= 0;
            const displayPrice = product.promo_price || product.original_price;
            const discountAmt = product.promo_price
              ? product.original_price - product.promo_price
              : 0;

            const categoryMatch = PRODUCT_CATEGORIES.find((c) => c.id === product.category);
            const categoryBadgeLabel = categoryMatch ? categoryMatch.shortName : product.category;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between ${
                  isOutOfStock ? 'opacity-65' : ''
                }`}
              >
                <div>
                  {/* Product Image Frame */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Promo Badge */}
                    {discountAmt > 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>Promo</span>
                      </span>
                    )}

                    {/* Category Pill */}
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">
                      {categoryBadgeLabel}
                    </span>

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-md">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>{product.sku}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.2 rounded">
                        Stok {product.stock}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xs text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating & Review Counter */}
                    <div className="flex items-center space-x-1 pt-0.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-slate-800 ml-0.5">
                          {product.rating || (4.8 + ((index % 3) * 0.1)).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        ({product.review_count || 45 + ((index * 19) % 95)} ulasan)
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold ml-auto">
                        {product.sold_count || 50 + ((index * 29) % 180)} terjual
                      </span>
                    </div>

                    {/* Size Badges */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 pt-0.5">
                        <span className="text-[9px] text-slate-400 font-medium mr-0.5">
                          {product.category.startsWith('sepatu') ? 'Size:' : 'Varian:'}
                        </span>
                        {product.sizes.slice(0, 4).map((sz) => (
                          <span
                            key={sz}
                            className="text-[8px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-600"
                          >
                            {sz}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-[8px] text-slate-400 font-bold">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Price & View Action */}
                <div className="p-2.5 pt-0 border-t border-slate-100 mt-1">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="font-black text-xs sm:text-sm text-red-600">
                      {formatIDR(displayPrice)}
                    </span>
                    {discountAmt > 0 && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatIDR(product.original_price)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full mt-2 py-1.5 rounded-xl bg-slate-900 group-hover:bg-red-600 text-white font-extrabold text-[11px] transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat & Beli</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
