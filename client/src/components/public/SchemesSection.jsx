import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, Home, HeartPulse, Flame, Droplets, Users } from 'lucide-react';

export default function SchemesSection() {
  const schemes = [
    {
      id: 1,
      title: "प्रधानमंत्री किसान सम्मान निधि",
      tag: "कृषि कल्याण",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "इटावा के किसानों को ₹6,000 प्रति वर्ष 3 समान किस्तों में सीधे बैंक खाते में आर्थिक सहायता।",
      beneficiaries: "1.45 लाख+ किसान लाभान्वित",
      icon: Users,
      iconColor: "text-emerald-600 bg-emerald-100"
    },
    {
      id: 2,
      title: "प्रधानमंत्री आवास योजना (ग्रामीण/शहरी)",
      tag: "आवास योजना",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      description: "हर बेघर व कच्चे मकान वाले परिवार को पक्का मकान, शौचालय एवं बुनियादी सुविधाएं उपलब्ध कराना।",
      beneficiaries: "32,400+ पक्के मकान स्वीकृत",
      icon: Home,
      iconColor: "text-blue-600 bg-blue-100"
    },
    {
      id: 3,
      title: "आयुष्मान भारत - जन आरोग्य योजना",
      tag: "स्वास्थ्य सुरक्षा",
      tagColor: "bg-rose-50 text-rose-700 border-rose-200",
      description: "प्रति परिवार ₹5 लाख तक का सालाना निःशुल्क एवं कैशलेस उपचार की सुविधा सरकारी व निजी अस्पतालों में।",
      beneficiaries: "2.1 लाख+ आयुष्मान गोल्डन कार्ड",
      icon: HeartPulse,
      iconColor: "text-rose-600 bg-rose-100"
    },
    {
      id: 4,
      title: "प्रधानमंत्री उज्ज्वला योजना 2.0",
      tag: "महिला सशक्तिकरण",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: "गरीब परिवारों की महिलाओं को निःशुल्क गैस कनेक्शन, चूल्हा व पहला रिफिल सिलिंडर उपलब्ध कराना।",
      beneficiaries: "48,000+ गैस कनेक्शन वितरित",
      icon: Flame,
      iconColor: "text-amber-600 bg-amber-100"
    },
    {
      id: 5,
      title: "जल जीवन मिशन - हर घर जल",
      tag: "पेयजल आपूर्ति",
      tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
      description: "इटावा विधानसभा के प्रत्येक ग्रामीण परिवार के घर तक पाइपलाइन से शुद्ध पेयजल की सतत आपूर्ति।",
      beneficiaries: "180+ ग्राम पंचायतों में नल कनेक्शन",
      icon: Droplets,
      iconColor: "text-cyan-600 bg-cyan-100"
    },
    {
      id: 6,
      title: "मुख्यमंत्री कन्या सुमंगला योजना",
      tag: "बालिका कल्याण",
      tagColor: "bg-purple-50 text-purple-700 border-purple-200",
      description: "बालिकाओं के जन्म से स्नातक शिक्षा तक 6 चरणों में कुल ₹25,000 की वित्तीय सहायता व सुरक्षा।",
      beneficiaries: "14,500+ बेटियां लाभान्वित",
      icon: ShieldCheck,
      iconColor: "text-purple-600 bg-purple-100"
    }
  ];

  return (
    <section id="schemes" className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>जनकल्याणकारी योजनाएं</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              लोकप्रिय सरकारी योजनाएं
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              केंद्र एवं उत्तर प्रदेश सरकार की जनकल्याणकारी योजनाओं की जानकारी व सहायता
            </p>
          </div>
          <a
            href="#citizen-connect"
            className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-xl border border-orange-200 shadow-sm transition"
          >
            <span>योजना सहायता हेतु संपर्क करें</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => {
            const Icon = scheme.icon;
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${scheme.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${scheme.tagColor}`}>
                      {scheme.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                    {scheme.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {scheme.beneficiaries}
                  </span>
                  <a
                    href="#citizen-connect"
                    className="font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                  >
                    <span>आवेदन सहायता</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
