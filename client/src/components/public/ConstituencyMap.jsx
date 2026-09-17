import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { MapPin, CheckCircle, Clock, Eye, Layers, Filter } from 'lucide-react';

export default function ConstituencyMap() {
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    const res = await api.getDevelopmentWorks();
    if (res.success) {
      setWorks(res.works);
    }
  };

  const filteredWorks = activeCategory === 'All'
    ? works
    : works.filter(w => (w.category || '').includes(activeCategory));

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === 'undefined' || !window.L) {
      // Dynamic load Leaflet script if needed
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapInstanceRef.current) return;
      // Etawah coordinates: 26.7769, 79.0238
      const map = window.L.map(mapContainerRef.current).setView([26.7769, 79.08], 11);
      mapInstanceRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; JanSeva Etawah',
        maxZoom: 18
      }).addTo(map);

      // Add pins for projects
      updateMarkers(works, map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filtered works change
  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      updateMarkers(filteredWorks, mapInstanceRef.current);
    }
  }, [filteredWorks]);

  const updateMarkers = (items, map) => {
    if (!window.L) return;
    // Clear previous markers
    if (map._markerGroup) {
      map.removeLayer(map._markerGroup);
    }

    const markerGroup = window.L.layerGroup().addTo(map);
    map._markerGroup = markerGroup;

    items.forEach((item) => {
      const lat = item.coordinates?.lat || (26.75 + Math.random() * 0.15);
      const lng = item.coordinates?.lng || (79.0 + Math.random() * 0.15);

      const color = item.status === 'Completed' ? '#16a34a' : item.status === 'In Progress' ? '#ea580c' : '#2563eb';

      const customIcon = window.L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(markerGroup);
      marker.on('click', () => {
        setSelectedWork(item);
      });
      marker.bindTooltip(`<b>${item.village}</b><br/>${item.title}`, { direction: 'top' });
    });
  };

  const categories = ['All', 'सड़क एवं परिवहन', 'शिक्षा', 'स्वास्थ्य', 'पेयजल', 'बिजली'];

  return (
    <section id="constituency" className="py-12 bg-slate-50 border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-green-700">भू-स्थानिक विकास इंटेलिजेंस</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              हमारा विधानसभा क्षेत्र (इटावा 200)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              मानचित्र पर क्लिक करके अपने गांव व क्षेत्र के विकास कार्यों की स्थिति जानें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeCategory === c
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c === 'All' ? 'सभी परियोजनाएं' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Map and Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Leaflet Interactive Map */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-3 border border-slate-200 shadow-md flex flex-col justify-between">
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full"></div>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
                <div className="font-bold text-slate-800 border-b border-slate-100 pb-1">कार्य स्थिति सूचकांक</div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-green-600"></span>
                  <span className="text-slate-700 font-medium">पूर्ण कार्य (Completed)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-orange-600"></span>
                  <span className="text-slate-700 font-medium">प्रगतिरत (In Progress)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700 font-medium">स्वीकृत (Approved)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 px-2 text-xs text-slate-500">
              <span>दिखाए जा रहे कार्य: <b>{filteredWorks.length}</b></span>
              <span className="text-orange-700 font-bold">सैफई • बकेवर • जसवंतनगर • भरथना • चकरनगर</span>
            </div>
          </div>

          {/* Project Details Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col justify-between">
            {selectedWork ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedWork.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedWork.status === 'Completed' ? '✓ पूर्ण कार्य' : '⏳ कार्य प्रगति पर'}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                    {selectedWork.budget}
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-orange-600 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>ग्राम: {selectedWork.village} ({selectedWork.block})</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedWork.title}
                  </h3>
                </div>

                <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                  <img
                    src={selectedWork.afterImage || selectedWork.beforeImage || '/images/poli3.png'}
                    alt={selectedWork.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/poli1.png'; }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedWork.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">विभाग:</span>
                    <span className="font-semibold text-slate-800">{selectedWork.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">श्रेणी:</span>
                    <span className="font-semibold text-slate-800">{selectedWork.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">सीधा लाभ:</span>
                    <span className="font-semibold text-green-700">{selectedWork.impact}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-inner">
                  🗺️
                </div>
                <h4 className="text-base font-bold text-slate-800">नक्शे पर पिन का चयन करें</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  इटावा विधानसभा क्षेत्र के किसी भी पिन पर क्लिक करके उस परियोजना की लागत, विभाग, फोटो और जनहित लाभ की विस्तृत जानकारी देखें।
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedWork(works[0])}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition shadow-sm"
                  >
                    नमूना कार्य देखें (रामपुर सड़क)
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <a
                href="#development"
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-orange-500/20"
              >
                <span>पूरा विकास विवरण देखें</span>
                <span>→</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
