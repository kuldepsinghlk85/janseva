import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Trash2,
  RefreshCw,
  Users,
  Check,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function ExcelContactImportModal({ isOpen, onClose, onSuccess, showToast }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [parsedRecords, setParsedRecords] = useState([]);
  const [importing, setImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [summary, setSummary] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Intelligent column detector
  const findValue = (row, candidates) => {
    const keys = Object.keys(row);
    for (const cand of candidates) {
      const match = keys.find(k => k.trim().toLowerCase() === cand.toLowerCase());
      if (match && row[match] !== undefined && row[match] !== null) {
        return String(row[match]).trim();
      }
    }
    return '';
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setErrorMsg('');
    setSummary(null);
    setFileName(uploadedFile.name);
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonRows || jsonRows.length === 0) {
          setErrorMsg('एक्सेल शीट खाली है या डेटा नहीं मिला।');
          setParsedRecords([]);
          return;
        }

        const normalized = jsonRows.map((row, idx) => {
          const name = findValue(row, ['नाम', 'पूरा नाम', 'नागरिक', 'नागरिक का नाम', 'name', 'full name', 'citizen name', 'contact name']);
          const rawMobile = findValue(row, ['मोबाइल', 'मोबाइल नंबर', 'फोन', 'mobile', 'phone', 'contact', 'mobile no', 'cell']);
          const village = findValue(row, ['गाँव', 'गांव', 'ग्राम', 'क्षेत्र', 'village', 'area', 'town', 'address']) || 'इटावा सदर';
          const type = findValue(row, ['श्रेणी', 'भूमिका', 'पद', 'कौन है', 'role', 'type', 'category', 'designation']) || 'Citizen';
          const booth = findValue(row, ['बूथ', 'बूथ संख्या', 'वार्ड', 'booth', 'booth no', 'ward']) || '';

          // Clean mobile
          const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

          return {
            key: idx + 1,
            name: name || `नागरिक ${idx + 1}`,
            mobile: cleanMobile,
            village,
            type,
            booth,
            isValidMobile: cleanMobile.length === 10
          };
        });

        const validList = normalized.filter(r => r.mobile && r.isValidMobile);
        if (validList.length === 0) {
          setErrorMsg('एक्सेल फाइल में 10-अंकीय वैध मोबाइल नंबर का कोई कॉलम नहीं मिला। कृपया कॉलम हेडर "नाम" और "मोबाइल" जांचें।');
        }

        setParsedRecords(normalized);
      } catch (err) {
        console.error('Failed reading excel:', err);
        setErrorMsg('फाइल पढ़ने में त्रुटि: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleRemoveRow = (idx) => {
    setParsedRecords(prev => prev.filter((_, i) => i !== idx));
  };

  const handleImportSubmit = async () => {
    const validRows = parsedRecords.filter(r => r.mobile && r.isValidMobile);
    if (validRows.length === 0) {
      setErrorMsg('इम्पोर्ट करने हेतु कम से कम एक वैध संपर्क रिकॉर्ड होना आवश्यक है।');
      return;
    }

    setImporting(true);
    setErrorMsg('');

    try {
      const recordsToSave = validRows.map(r => ({
        name: r.name,
        mobile: r.mobile,
        village: r.village,
        booth: r.booth,
        type: r.type,
        source: 'Excel File Upload'
      }));

      const res = await api.bulkImportCitizens(recordsToSave, `Excel: ${fileName}`, 'Admin (Directory)');
      if (res?.success) {
        setSummary({
          added: res.added,
          duplicates: res.duplicates,
          total: res.totalCitizens
        });
        showToast?.(`एक्सेल इम्पोर्ट सफल: ${res.added} नए नागरिक जुड़े (${res.duplicates} डुप्लिकेट छोड़े गए)`, 'success');
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res?.message || 'इम्पोर्ट विफल रहा।');
      }
    } catch (err) {
      setErrorMsg('सर्वर से संपर्क नहीं हो सका: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  // Generate Sample Downloadable Excel
  const handleDownloadSample = () => {
    const sampleData = [
      { 'नाम': 'रामसेवक शर्मा', 'मोबाइल नंबर': '9876543210', 'गाँव / क्षेत्र': 'सैफई', 'श्रेणी / कौन है': 'बूथ अध्यक्ष', 'बूथ संख्या': 'बूथ संख्या 12' },
      { 'नाम': 'अनिता देवी', 'मोबाइल नंबर': '9876543211', 'गाँव / क्षेत्र': 'रामपुर', 'श्रेणी / कौन है': 'महिला मोर्चा', 'बूथ संख्या': 'बूथ संख्या 15' },
      { 'नाम': 'विकास कुमार', 'मोबाइल नंबर': '9876543212', 'गाँव / क्षेत्र': 'भरथना', 'श्रेणी / कौन है': 'युवा मोर्चा', 'बूथ संख्या': 'बूथ संख्या 08' },
      { 'नाम': 'दिनेश तिवारी', 'मोबाइल नंबर': '9876543213', 'गाँव / क्षेत्र': 'बकेवर', 'श्रेणी / कौन है': 'सक्रिय कार्यकर्ता', 'बूथ संख्या': 'बूथ संख्या 04' },
      { 'नाम': 'सुरेश पाल', 'मोबाइल नंबर': '9876543214', 'गाँव / क्षेत्र': 'जसवंतनगर', 'श्रेणी / कौन है': 'सामान्य नागरिक', 'बूथ संख्या': 'बूथ संख्या 22' }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'नागरिक_सूची_नमूना');
    XLSX.writeFile(wb, 'JanSeva_Etawah_Contacts_Sample.xlsx');
    showToast?.('सैंपल एक्सेल टेम्पलेट डाउनलोड हो गया!', 'info');
  };

  const validCount = parsedRecords.filter(r => r.isValidMobile).length;
  const invalidCount = parsedRecords.length - validCount;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-auto max-h-[92vh] flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                एमएस एक्सेल / CSV से नागरिक संपर्क सूची अपलोड करें
              </h3>
              <p className="text-xs text-slate-500">
                .xlsx, .xls या .csv फाइल अपलोड करके सैकड़ों नाम व मोबाइल नंबर एक साथ जोड़ें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone & Actions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-700/20 active:scale-95 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{fileName ? `फाइल बदलें (${fileName})` : 'एक्सेल फाइल चुनें (.xlsx / .csv)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>सैंपल एक्सेल फॉर्मेट डाउनलोड करें</span>
            </button>
          </div>

          {/* Success Summary Banner */}
          {summary && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-start space-x-2.5 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-black text-sm">एक्सेल सूची सफलतापूर्वक डेटाबेस में जोड़ी गई!</div>
                <div>• जोड़े गए नए संपर्क: <b>{summary.added}</b></div>
                <div>• पहले से मौजूद (डुप्लिकेट) संपर्क: <b>{summary.duplicates}</b></div>
                <div>• कुल सक्रिय संपर्क डेटाबेस: <b>{summary.total}</b></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Parsed Preview Table */}
        {parsedRecords.length > 0 && (
          <div className="space-y-2 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <div className="flex items-center space-x-2">
                <span>पहचाने गए कुल रिकॉर्ड: {parsedRecords.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">
                  वैध मोबाइल: {validCount}
                </span>
                {invalidCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px]">
                    अमान्य: {invalidCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setParsedRecords([])}
                className="text-slate-400 hover:text-rose-600 text-xs font-semibold"
              >
                सूची साफ करें
              </button>
            </div>

            <div className="overflow-y-auto border border-slate-200 rounded-2xl flex-1 max-h-64 shadow-inner">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">नागरिक का नाम</th>
                    <th className="p-2.5">मोबाइल नंबर</th>
                    <th className="p-2.5">गाँव / क्षेत्र</th>
                    <th className="p-2.5">श्रेणी / पद</th>
                    <th className="p-2.5">बूथ</th>
                    <th className="p-2.5 text-center">हटाएं</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {parsedRecords.map((r, i) => (
                    <tr key={r.key || i} className={`hover:bg-slate-50 ${!r.isValidMobile ? 'bg-rose-50/40 text-rose-900' : ''}`}>
                      <td className="p-2.5 text-center text-slate-400 font-mono">{i + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{r.name}</td>
                      <td className="p-2.5 font-mono">
                        {r.mobile ? (
                          <span className={r.isValidMobile ? 'text-slate-800 font-bold' : 'text-rose-600 font-bold'}>
                            {r.mobile} {!r.isValidMobile && '(10 अंक नहीं)'}
                          </span>
                        ) : (
                          <span className="text-rose-500 italic font-bold">खाली</span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-600">{r.village}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {r.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500 font-mono text-[11px]">{r.booth || '—'}</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleRemoveRow(i)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                          title="पंक्ति हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>एक्सेल कॉलम: नाम, मोबाइल, गाँव, श्रेणी, बूथ (हिंदी/English दोनों मान्य)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              बंद करें
            </button>

            <button
              type="button"
              onClick={handleImportSubmit}
              disabled={importing || validCount === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
            >
              {importing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              <span>डेटाबेस में सेव करें ({validCount} संपर्क)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
