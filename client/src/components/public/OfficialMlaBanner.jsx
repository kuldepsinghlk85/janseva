import React from 'react';
import { useApp } from '../../context/AppContext';

export default function OfficialMlaBanner() {
  const { settings } = useApp();
  const schedule = settings?.mlaPhotoSchedule || {};
  const showBanner = schedule.showOfficialBanner ?? true;
  const bannerImage = schedule.officialBanner || settings?.hero?.officialBanner || '/images/assets/official_bjp_mla_banner.jpg';

  if (!showBanner) return null;

  return (
    <div className="w-full bg-slate-900 border-b-2 border-orange-500 shadow-md overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] md:aspect-[3.6/1] max-h-56 overflow-hidden">
          <img
            src={bannerImage}
            alt="भाजपा का लक्ष्य - सशक्त भारत, समृद्ध उत्तर प्रदेश, विकसित इटावा | श्रीमती सरिता भदौरिया (सदर विधायक, इटावा)"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = '/images/assets/bottom_leaders_trio.jpg';
            }}
          />
        </div>
      </div>
    </div>
  );
}
