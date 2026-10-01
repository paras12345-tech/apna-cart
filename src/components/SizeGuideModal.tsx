import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SizeGuideModal: React.FC = () => {
  const { sizeGuideOpen, setSizeGuideOpen, selectedProduct } = useApp();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!sizeGuideOpen) return null;

  const isFootwear = selectedProduct?.category === 'Footwear';

  const apparelSizesInches = [
    { size: 'XS', chest: '36', shoulder: '16.5', length: '27', waist: '30' },
    { size: 'S', chest: '38', shoulder: '17', length: '28', waist: '32' },
    { size: 'M', chest: '40', shoulder: '17.5', length: '29', waist: '34' },
    { size: 'L', chest: '42', shoulder: '18', length: '30', waist: '36' },
    { size: 'XL', chest: '44', shoulder: '18.5', length: '31', waist: '38' },
    { size: 'XXL', chest: '46', shoulder: '19', length: '32', waist: '40' },
  ];

  const apparelSizesCm = apparelSizesInches.map((item) => ({
    size: item.size,
    chest: (parseFloat(item.chest) * 2.54).toFixed(1),
    shoulder: (parseFloat(item.shoulder) * 2.54).toFixed(1),
    length: (parseFloat(item.length) * 2.54).toFixed(1),
    waist: (parseFloat(item.waist) * 2.54).toFixed(1),
  }));

  const footwearSizes = [
    { uk: 'UK 6', eu: '40', us: '7', footLengthCm: '25.0' },
    { uk: 'UK 7', eu: '41', us: '8', footLengthCm: '25.8' },
    { uk: 'UK 8', eu: '42', us: '9', footLengthCm: '26.7' },
    { uk: 'UK 9', eu: '43', us: '10', footLengthCm: '27.5' },
    { uk: 'UK 10', eu: '44', us: '11', footLengthCm: '28.3' },
    { uk: 'UK 11', eu: '45', us: '12', footLengthCm: '29.2' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setSizeGuideOpen(false)}
      />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-6 z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-base text-slate-900 font-serif">
              {isFootwear ? 'Footwear Sizing Chart' : 'Garment Size Guide'}
            </h3>
          </div>
          <button
            onClick={() => setSizeGuideOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit switcher */}
        {!isFootwear && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-slate-500 font-medium">Unit:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  unit === 'in' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Centimeters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {isFootwear ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">UK / India</th>
                  <th className="py-2.5 px-3">Euro</th>
                  <th className="py-2.5 px-3">US</th>
                  <th className="py-2.5 px-3">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {footwearSizes.map((row) => (
                  <tr key={row.uk} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold">{row.uk}</td>
                    <td className="py-2.5 px-3 font-mono">{row.eu}</td>
                    <td className="py-2.5 px-3 font-mono">{row.us}</td>
                    <td className="py-2.5 px-3 font-mono">{row.footLengthCm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest ({unit})</th>
                  <th className="py-2.5 px-3">Shoulder ({unit})</th>
                  <th className="py-2.5 px-3">Length ({unit})</th>
                  <th className="py-2.5 px-3">Waist ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {(unit === 'in' ? apparelSizesInches : apparelSizesCm).map((row) => (
                  <tr key={row.size} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold">{row.size}</td>
                    <td className="py-2.5 px-3 font-mono">{row.chest}</td>
                    <td className="py-2.5 px-3 font-mono">{row.shoulder}</td>
                    <td className="py-2.5 px-3 font-mono">{row.length}</td>
                    <td className="py-2.5 px-3 font-mono">{row.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px] leading-relaxed">
          <span className="font-semibold text-slate-900 block mb-0.5">How to measure:</span>
          Measure around the fullest part of your chest or bust, keeping the measuring tape horizontal. For length, measure from highest point of the shoulder down to the hemline.
        </div>
      </div>
    </div>
  );
};
