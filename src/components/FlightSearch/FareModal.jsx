// FareModalDemo.jsx (single file)
// React + Tailwind CSS

import React, { useRef, useState } from 'react';

export default function FareModalDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('value');
  const scrollRef = useRef(null);

  const fares = [
    {
      id: 'value',
      title: 'Economy Value',
      price: 8650,
      perks: [
        { ok: true, text: '7 Kg Cabin Baggage /Adult' },
        { ok: true, text: '20 Kg Check-In Baggage /Adult' },
        { ok: false, text: 'Refund Allowed with Fee' },
        { ok: false, text: 'Reissue Allowed with Fee' },
        { ok: true, text: 'Get complementary meal' }
      ]
    },
    {
      id: 'flex',
      title: 'Economy Flex',
      price: 10700,
      perks: [
        { ok: true, text: '7 Kg Cabin Baggage /Adult' },
        { ok: true, text: '20 Kg Check-In Baggage /Adult' },
        { ok: true, text: 'Refund Allowed with Fee' },
        { ok: true, text: 'Reissue Allowed with Fee' },
        { ok: true, text: 'Get complementary meal' }
      ]
    }
  ];

  function scrollBy(offset) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  }

  function handleContinue() {
    window.location.href = '/fare';
  }

  return (
    <div className=" flex ">
      <div className="w-full ">
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-gray-100 text-[14px] p-2 font-medium rounded-full hover:bg-gray-200"
          >
            View Prices
          </button>

          <a
            href="/fare"
            className="w-full bg-red-600 text-[14px] text-white font-semibold rounded-full hover:bg-red-500 flex items-center justify-center p-2"
          >
            Select
          </a>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <div className="relative bg-white rounded-2xl w-[94%] max-w-6xl p-1 shadow-2xl">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 18L18 6" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <h3 className="text-lg font-semibold bg-white text-gray-800 p-4">More fare options available for your trip.</h3>
              {/* start card */}
              <div className='bg-sky-50 border border-gray-200'>
             <div className=" flex items-center gap-3 pt-4 text-sm  text-gray-600">
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12h20" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Dhaka</span>
                  <span className="text-gray-400">→</span>
                  <span>Cox's Bazar</span>
                </div>
                <div className="text-gray-400">•</div>
                <div>US Bangla Airlines</div>
                <div className="text-gray-400">•</div>
                <div className="text-sm">Fri, 26 Sep 25 • Departure at 19:10 - Arrival at 20:15</div>
              </div>

              <div className=" relative pb-24">
                <button
                  onClick={() => scrollBy(-360)}
                  className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6L9 12L15 18" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollBy(360)}
                  className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div ref={scrollRef} className="flex gap-4 bg-sky-50 p-4 overflow-x-auto pb-4 scrollbar-hide">
                  {fares.map((f) => (
                    <div
                      key={f.id}
                      className={`min-w-[320px]  flex-shrink-0 rounded-xl p-4 bg-white border ${selected === f.id ? 'border-red-300 shadow-[0_6px_20px_rgba(220,38,38,0.12)]' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between ">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{f.title}</h4>
                          <div className="text-xs text-gray-500 mt-1 ">fare offered by airline</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">BDT</div>
                          <div className="text-2xl font-bold text-red-600">{f.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mt-4  rounded-md p-3 text-sm text-gray-700 h-64 overflow-y-auto">
                        <div className="text-xs font-medium bg-sky-50 p-2 rounded-md text-gray-800 mb-2">Baggage</div>
                        <ul className="space-y-2">
                          {f.perks.map((p, i) => (
                            <li key={i} className="flex items-center gap-2">
                              {p.ok ? (
                                <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none">
                                  <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none">
                                  <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                              <span className={`text-sm ${p.ok ? 'text-gray-700' : 'text-gray-400'}`}>{p.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">BDT <span className="font-bold text-xl text-red-600">{f.price.toLocaleString()}</span></div>
                        <button
                          onClick={() => setSelected(f.id)}
                          className={`px-4 py-2 rounded-full font-medium ${selected === f.id ? 'bg-white text-red-600 border border-red-600' : 'bg-red-600 text-white'}`}
                        >
                          {selected === f.id ? (
                            <span className="flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Selected</span>
                          ) : (
                            'Select'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
             
          {/* end card */}
              <div className="  p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                   
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">One Way</div>
                    <div className="text-sm font-semibold text-sky-600">{fares.find(f => f.id === selected).title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Subtotal</div>
                    <div className="text-lg font-extrabold text-red-600">BDT {fares.find(f => f.id === selected).price.toLocaleString()}</div>
                  </div>
                  <button onClick={handleContinue} className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow">Continue</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}