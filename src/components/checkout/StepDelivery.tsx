'use client'

import { DeliveryDetails } from '@/types/shop'
import { Building, Home } from 'lucide-react'

type Props = {
  details: DeliveryDetails
  onChange: (details: DeliveryDetails) => void
}

const hostels = [
  'CV Raman', 'Aryabhatta', 'Asima', 'Kalam'
]

export default function StepDelivery({ details, onChange }: Props) {
  const update = (fields: Partial<DeliveryDetails>) => {
    onChange({ ...details, ...fields })
  }
  const handleTypeChange = (type: 'in-campus' | 'out-of-campus') => {
    if (type === 'in-campus') {
      onChange({
        type: 'in-campus',
        hostel: '',
        roomNumber: '',
        notes: ''
      })
    } else {
      onChange({
        type: 'out-of-campus',
        addressLine: '',
        city: '',
        state: '',
        postalCode: ''
      })
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Collection Route</h2>
      <p className="text-[#888] text-sm mb-8">Designate the drop point for your artifacts and passes.</p>

      {/* Mode Selector */}
      <div className="flex mb-8 border border-[#e0ddd8] rounded overflow-hidden">
        <button
          type="button"
          onClick={() => handleTypeChange('in-campus')} // Updated to use reset helper
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest transition-colors ${details.type === 'in-campus'
            ? 'bg-[#1a1a1a] text-white'
            : 'text-[#888] hover:bg-[#f8f7f4]'
            }`}
        >
          <Building size={12} />
          IN CAMPUS
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('out-of-campus')} // Updated to use reset helper
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest transition-colors ${details.type === 'out-of-campus'
            ? 'bg-[#1a1a1a] text-white'
            : 'text-[#888] hover:bg-[#f8f7f4]'
            }`}
        >
          <Home size={12} />
          OUT OF CAMPUS
        </button>
      </div>

      {/* In-Campus Fields */}
      {details.type === 'in-campus' && (
        <div className="space-y-6">
          <div>
            <label className="text-xs tracking-widest text-[#aaa] block mb-2">HOSTEL SECTOR</label>
            <select
              value={details.hostel ?? ''}
              onChange={e => update({ hostel: e.target.value })}
              className="w-full border border-[#e0ddd8] rounded px-3 py-3 text-sm text-[#1a1a1a] bg-white outline-none focus:border-[#888] transition-colors"
            >
              <option value="">Select hostel...</option>
              {hostels.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs tracking-widest text-[#aaa] block mb-2">ROOM / COORDINATE</label>
            <input
              value={details.roomNumber ?? ''}
              onChange={e => update({ roomNumber: e.target.value })}
              placeholder="e.g. A-304"
              className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest text-[#aaa] block mb-2">COLLECTION NOTES (OPTIONAL)</label>
            <textarea
              value={details.notes ?? ''}
              onChange={e => update({ notes: e.target.value })}
              placeholder="Leave at reception, etc."
              rows={3}
              className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors resize-none"
            />
          </div>
        </div>
      )}

      {/* Out-of-Campus Fields */}
      {details.type === 'out-of-campus' && (
        <div className="space-y-6">
          <div>
            <label className="text-xs tracking-widest text-[#aaa] block mb-2">ADDRESS LINE</label>
            <input
              value={details.addressLine ?? ''}
              onChange={e => update({ addressLine: e.target.value })}
              placeholder="Street address"
              className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest text-[#aaa] block mb-2">CITY</label>
              <input
                value={details.city ?? ''}
                onChange={e => update({ city: e.target.value })}
                placeholder="City"
                className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest text-[#aaa] block mb-2">STATE</label>
              <input
                value={details.state ?? ''}
                onChange={e => update({ state: e.target.value })}
                placeholder="State"
                className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs tracking-widest text-[#aaa] block mb-2">POSTAL CODE</label>
            <input
              value={details.postalCode ?? ''}
              onChange={e => update({ postalCode: e.target.value })}
              placeholder="PIN Code"
              className="w-full border-b border-[#e0ddd8] bg-transparent py-2 text-sm text-[#1a1a1a] placeholder-[#ccc] outline-none focus:border-[#888] transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  )
}