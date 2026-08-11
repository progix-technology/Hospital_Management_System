import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode, Search, Filter, Microscope, Clock, DollarSign,
  Plus, CheckCircle2, ShieldAlert, Sparkles, BookOpen, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';

export default function LabTestsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [tests, setTests] = useState([
    { code: 'LBT-101', name: 'Complete Blood Count (CBC)', category: 'Hematology', referenceRange: 'Hb: 13.5-17.5 g/dL | WBC: 4,000-11,000 /mcL | Platelets: 1.5-4.5 Lakhs', turnaround: '4 Hours', sampleRequired: 'EDTA Whole Blood (2 ml)', price: 350 },
    { code: 'LBT-102', name: 'Fasting Blood Sugar (FBS)', category: 'Biochemistry', referenceRange: 'Fasting Glucose: 70 - 99 mg/dL (Normal)', turnaround: '2 Hours', sampleRequired: 'Fluoride Plasma (1 ml)', price: 150 },
    { code: 'LBT-103', name: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', referenceRange: 'Normal: < 5.7% | Prediabetes: 5.7-6.4% | Diabetic: >= 6.5%', turnaround: '6 Hours', sampleRequired: 'EDTA Blood (2 ml)', price: 600 },
    { code: 'LBT-104', name: 'Lipid Profile Panel', category: 'Biochemistry', referenceRange: 'Cholesterol: <200 mg/dL | Triglycerides: <150 mg/dL | HDL: >40 mg/dL', turnaround: '6 Hours', sampleRequired: 'Serum Fasting (3 ml)', price: 750 },
    { code: 'LBT-105', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', referenceRange: 'TSH: 0.5 - 4.5 uIU/mL | Total T3: 80 - 200 ng/dL', turnaround: '12 Hours', sampleRequired: 'Plain Serum (2 ml)', price: 900 },
    { code: 'LBT-106', name: 'Liver Function Test (LFT)', category: 'Biochemistry', referenceRange: 'Bilirubin Total: 0.2 - 1.2 mg/dL | SGOT/AST: 10 - 40 U/L | SGPT/ALT: 7 - 56 U/L', turnaround: '8 Hours', sampleRequired: 'Plain Serum (3 ml)', price: 850 },
    { code: 'LBT-107', name: 'Kidney Function Test (KFT / RFT)', category: 'Biochemistry', referenceRange: 'Urea: 15 - 40 mg/dL | Creatinine: 0.6 - 1.2 mg/dL | Uric Acid: 3.5 - 7.2 mg/dL', turnaround: '8 Hours', sampleRequired: 'Serum (2 ml)', price: 800 },
    { code: 'LBT-108', name: 'Urine Routine & Microscopy', category: 'Clinical Pathology', referenceRange: 'Color: Pale Yellow | Protein: Nil | Pus Cells: 0-2 /hpf', turnaround: '3 Hours', sampleRequired: 'Midstream Urine (10 ml)', price: 200 },
    { code: 'LBT-109', name: 'Vitamin D3 (25-Hydroxy)', category: 'Immunology', referenceRange: 'Deficient: <20 ng/mL | Insufficient: 20-30 ng/mL | Sufficient: 30-100 ng/mL', turnaround: '24 Hours', sampleRequired: 'Serum (2 ml)', price: 1400 },
    { code: 'LBT-110', name: 'Vitamin B12 (Cyanocobalamin)', category: 'Immunology', referenceRange: 'Normal: 211 - 911 pg/mL', turnaround: '24 Hours', sampleRequired: 'Serum (2 ml)', price: 1100 },
    { code: 'LBT-111', name: 'Serum Electrolytes (Na, K, Cl)', category: 'Biochemistry', referenceRange: 'Sodium: 136-145 mEq/L | Potassium: 3.5-5.1 mEq/L | Chloride: 98-107 mEq/L', turnaround: '4 Hours', sampleRequired: 'Serum (2 ml)', price: 500 },
    { code: 'LBT-112', name: 'C-Reactive Protein (CRP Quantitative)', category: 'Immunology', referenceRange: 'Normal: < 6.0 mg/L', turnaround: '6 Hours', sampleRequired: 'Serum (2 ml)', price: 650 },
    { code: 'LBT-113', name: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Hematology', referenceRange: 'Male: 0-15 mm/hr | Female: 0-20 mm/hr', turnaround: '2 Hours', sampleRequired: 'EDTA Blood (2 ml)', price: 180 },
    { code: 'LBT-114', name: 'Blood Grouping & Rh Factor', category: 'Hematology', referenceRange: 'A, B, AB, O (Rh Positive / Negative)', turnaround: '1 Hour', sampleRequired: 'EDTA Blood (1 ml)', price: 150 },
    { code: 'LBT-115', name: 'Dengue NS1 Antigen & IgM/IgG', category: 'Serology', referenceRange: 'Non-Reactive (Negative)', turnaround: '4 Hours', sampleRequired: 'Serum (2 ml)', price: 950 },
    { code: 'LBT-116', name: 'Typhoid Widal Slide Test', category: 'Serology', referenceRange: 'TO & TH Titer: < 1:80 (Negative)', turnaround: '3 Hours', sampleRequired: 'Serum (2 ml)', price: 300 },
    { code: 'LBT-117', name: 'Prothrombin Time / INR (PT-INR)', category: 'Hematology', referenceRange: 'Control: 11-13.5 sec | INR: 0.8 - 1.1', turnaround: '4 Hours', sampleRequired: 'Sodium Citrate Blood (2 ml)', price: 450 },
    { code: 'LBT-118', name: 'Serum Amylase & Lipase', category: 'Biochemistry', referenceRange: 'Amylase: 28-100 U/L | Lipase: 13-60 U/L', turnaround: '6 Hours', sampleRequired: 'Serum (2 ml)', price: 900 },
    { code: 'LBT-119', name: 'Rheumatoid Factor (RA Factor)', category: 'Immunology', referenceRange: 'Normal: < 14 IU/mL', turnaround: '12 Hours', sampleRequired: 'Serum (2 ml)', price: 550 },
    { code: 'LBT-120', name: 'Serum Ferritin', category: 'Immunology', referenceRange: 'Male: 20-250 ng/mL | Female: 10-120 ng/mL', turnaround: '12 Hours', sampleRequired: 'Serum (2 ml)', price: 850 },
    { code: 'LBT-121', name: 'Stool Routine & Culture', category: 'Clinical Pathology', referenceRange: 'Occult Blood: Negative | Parasites: Nil', turnaround: '24 Hours', sampleRequired: 'Stool Specimen', price: 250 },
    { code: 'LBT-122', name: 'HIV I & II Rapid Antibody', category: 'Serology', referenceRange: 'Non-Reactive (Negative)', turnaround: '4 Hours', sampleRequired: 'Serum (2 ml)', price: 400 },
    { code: 'LBT-123', name: 'Hepatitis B Surface Ag (HBsAg)', category: 'Serology', referenceRange: 'Non-Reactive (Negative)', turnaround: '4 Hours', sampleRequired: 'Serum (2 ml)', price: 450 },
    { code: 'LBT-124', name: 'Chest X-Ray PA View', category: 'Radiology', referenceRange: 'Lungs clear, cardiac size normal, costophrenic angles sharp', turnaround: '2 Hours', sampleRequired: 'Digital X-Ray Scan', price: 500 },
    { code: 'LBT-125', name: '12-Lead Electrocardiogram (ECG)', category: 'Radiology', referenceRange: 'Normal Sinus Rhythm, HR 60-100 bpm', turnaround: '30 Mins', sampleRequired: 'ECG Lead Tracing', price: 300 },
    { code: 'LBT-126', name: 'Serum Iron & TIBC Profile', category: 'Biochemistry', referenceRange: 'Iron: 60-170 mcg/dL | TIBC: 240-450 mcg/dL', turnaround: '12 Hours', sampleRequired: 'Serum (3 ml)', price: 750 },
    { code: 'LBT-127', name: 'Post Prandial Blood Sugar (PPBS)', category: 'Biochemistry', referenceRange: 'Normal 2-hr post meal: < 140 mg/dL', turnaround: '2 Hours', sampleRequired: 'Fluoride Plasma (1 ml)', price: 150 },
    { code: 'LBT-128', name: 'Anti-TPO Thyroid Antibodies', category: 'Endocrinology', referenceRange: 'Normal: < 34 IU/mL', turnaround: '24 Hours', sampleRequired: 'Serum (2 ml)', price: 1200 }
  ]);

  const [newTestData, setNewTestData] = useState({
    code: `LBT-${129 + tests.length - 28}`,
    name: '',
    category: 'Biochemistry',
    referenceRange: '',
    turnaround: '6 Hours',
    sampleRequired: 'Serum (2 ml)',
    price: ''
  });

  const handleAddTestSubmit = (e) => {
    e.preventDefault();
    if (!newTestData.name || !newTestData.price) {
      alert('Please fill test name and price.');
      return;
    }
    const newEntry = {
      code: `LBT-${129 + tests.length - 28}`,
      name: newTestData.name,
      category: newTestData.category,
      referenceRange: newTestData.referenceRange || 'Standard hospital reference interval',
      turnaround: newTestData.turnaround,
      sampleRequired: newTestData.sampleRequired,
      price: Number(newTestData.price) || 500
    };
    setTests([newEntry, ...tests]);
    setShowAddModal(false);
    setNewTestData({ code: '', name: '', category: 'Biochemistry', referenceRange: '', turnaround: '6 Hours', sampleRequired: 'Serum (2 ml)', price: '' });
    alert(`New diagnostic test "${newEntry.name}" added to catalog!`);
  };

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diagnostic Tests Master Catalog ({tests.length} Tests)
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Pathology test master directory, reference intervals, turnaround times, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0f6c4f] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add New Test Definition
          </Button>
        </div>
      </div>

      {/* Filter Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test name, code or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Biochemistry', 'Hematology', 'Endocrinology', 'Immunology', 'Serology', 'Clinical Pathology', 'Radiology'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#0f6c4f] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.code} className="border-slate-100 shadow-xs hover:shadow-md transition-all bg-white overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#0f6c4f]/10 text-[#0f6c4f] text-[10px] font-black tracking-wide">
                    {test.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-100">
                    {test.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{test.name}</h3>
              </div>
              <span className="font-extrabold text-slate-900 text-sm bg-emerald-50 text-[#0f6c4f] px-3 py-1 rounded-xl border border-emerald-100">
                ₹ {test.price}
              </span>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5 mb-1">
                  <BookOpen className="h-3.5 w-3.5 text-[#0f6c4f]" /> Standard Reference Range:
                </p>
                <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{test.referenceRange}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Turnaround: <strong>{test.turnaround}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Microscope className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Sample: <strong>{test.sampleRequired}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Test Definition Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Add New Pathology Test</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Define Test Name, Reference Range & Price</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddTestSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Test Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Serum Ferritin Level"
                    value={newTestData.name}
                    onChange={(e) => setNewTestData({ ...newTestData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Department</label>
                    <select
                      value={newTestData.category}
                      onChange={(e) => setNewTestData({ ...newTestData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
                    >
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Immunology">Immunology</option>
                      <option value="Serology">Serology</option>
                      <option value="Clinical Pathology">Clinical Pathology</option>
                      <option value="Radiology">Radiology</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Price (₹) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 750"
                      value={newTestData.price}
                      onChange={(e) => setNewTestData({ ...newTestData, price: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Standard Reference Range</label>
                  <input
                    type="text"
                    placeholder="e.g. Normal Range: 20-250 ng/mL"
                    value={newTestData.referenceRange}
                    onChange={(e) => setNewTestData({ ...newTestData, referenceRange: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f6c4f]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Hours"
                      value={newTestData.turnaround}
                      onChange={(e) => setNewTestData({ ...newTestData, turnaround: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Sample Container</label>
                    <input
                      type="text"
                      placeholder="e.g. Serum (2 ml)"
                      value={newTestData.sampleRequired}
                      onChange={(e) => setNewTestData({ ...newTestData, sampleRequired: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-10 rounded-xl font-bold border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 rounded-xl font-bold bg-[#0f6c4f] hover:bg-emerald-800 text-white"
                  >
                    Save Test Definition
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
