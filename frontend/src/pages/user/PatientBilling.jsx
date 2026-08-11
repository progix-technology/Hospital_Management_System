import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { 
  CreditCard, Download, FileText, CheckCircle2, Clock, Plus, Trash2, 
  Smartphone, Building, X, Lock, ShieldCheck, Check, Wallet, ArrowUpRight 
} from 'lucide-react';
import axios from 'axios';

export default function PatientBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  // Saved Payment Methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [methodType, setMethodType] = useState('card'); // 'card' | 'upi' | 'bank'
  const [isDefault, setIsDefault] = useState(false);

  // Form State
  const [cardForm, setCardForm] = useState({ holderName: '', number: '', expiry: '', cvv: '' });
  const [upiForm, setUpiForm] = useState({ upiId: '', provider: 'Google Pay' });
  const [bankForm, setBankForm] = useState({ accountName: '', bankName: 'HDFC Bank', accountNumber: '', ifsc: '' });

  // Quick Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [processingPay, setProcessingPay] = useState(false);

  // Current Patient Info
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo._id || 'guest';

  // Load Saved Payment Methods from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`patient_payment_methods_${userId}`);
      if (saved) {
        setPaymentMethods(JSON.parse(saved));
      } else {
        const defaults = [
          {
            id: 'PM-1',
            type: 'card',
            brand: 'Visa',
            title: 'Visa ending in 4242',
            subtitle: 'Expires 12/28',
            holderName: userInfo.name || 'Mahendra Yadav',
            isDefault: true
          },
          {
            id: 'PM-2',
            type: 'upi',
            brand: 'UPI',
            title: 'PhonePe / GPay UPI',
            subtitle: `${userInfo.phone ? userInfo.phone : '9876543210'}@ybl`,
            holderName: userInfo.name || 'Mahendra Yadav',
            isDefault: false
          }
        ];
        setPaymentMethods(defaults);
        localStorage.setItem(`patient_payment_methods_${userId}`, JSON.stringify(defaults));
      }
    } catch (e) {}
  }, [userId]);

  const savePaymentMethodsToStorage = (methods) => {
    setPaymentMethods(methods);
    try {
      localStorage.setItem(`patient_payment_methods_${userId}`, JSON.stringify(methods));
    } catch (e) {}
  };

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        if (userInfo && userInfo._id) {
          const { data: profile } = await axios.get(`http://localhost:5000/api/users/profile/${userInfo._id}`);
          const { data: appointments } = await axios.get(`http://localhost:5000/api/appointments`);
          
          if (Array.isArray(appointments)) {
            const patientApts = appointments.filter(apt => 
              apt.patient?._id?.toString() === userInfo._id || 
              apt.patient?.toString() === userInfo._id
            );

            let outstanding = 0;
            const mappedInvoices = patientApts.map((apt, idx) => {
              const amountVal = apt.fees || 150;
              const isPaid = apt.status === 'Completed';
              
              if (!isPaid) {
                outstanding += amountVal;
              }

              return {
                id: `INV-DOC-${String(idx + 1).padStart(3, '0')}`,
                date: apt.date ? new Date(apt.date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : 'N/A',
                service: `${apt.doctor?.specialty || 'General'} Consultation with Dr. ${apt.doctor?.name || 'Specialist'}`,
                amount: `₹${amountVal}`,
                amountNum: amountVal,
                status: isPaid ? 'Paid' : 'Unpaid',
                dueDate: apt.date ? new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'
              };
            });

            // Include Paid Lab Test Invoices
            if (profile?.paidLabTests && Array.isArray(profile.paidLabTests)) {
              profile.paidLabTests.forEach((labPay, lIdx) => {
                mappedInvoices.unshift({
                  id: `INV-LAB-${String(lIdx + 1).padStart(3, '0')}`,
                  date: new Date(labPay.paidAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }),
                  service: `Diagnostic Lab Test: ${labPay.testName}`,
                  amount: `₹${labPay.amount || 350}`,
                  amountNum: labPay.amount || 350,
                  status: 'Paid',
                  dueDate: 'Paid at Laboratory Desk'
                });
              });
            }

            setInvoices(mappedInvoices);
            setTotalOutstanding(outstanding);
          }
        }
      } catch (err) {
        console.error('Error fetching billing invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  // Handle Add New Payment Method
  const handleAddNewMethod = (e) => {
    e.preventDefault();

    let newMethod = null;
    const newId = `PM-${Date.now()}`;

    if (methodType === 'card') {
      if (!cardForm.number || !cardForm.expiry) {
        alert('Please fill in valid card details');
        return;
      }
      const last4 = cardForm.number.replace(/\s+/g, '').slice(-4) || '8821';
      newMethod = {
        id: newId,
        type: 'card',
        brand: cardForm.number.startsWith('4') ? 'Visa' : cardForm.number.startsWith('5') ? 'Mastercard' : 'RuPay',
        title: `Card ending in ${last4}`,
        subtitle: `Expires ${cardForm.expiry}`,
        holderName: cardForm.holderName || userInfo.name || 'Account Holder',
        isDefault
      };
    } else if (methodType === 'upi') {
      if (!upiForm.upiId) {
        alert('Please enter a valid UPI ID');
        return;
      }
      newMethod = {
        id: newId,
        type: 'upi',
        brand: 'UPI',
        title: upiForm.provider || 'UPI ID',
        subtitle: upiForm.upiId,
        holderName: userInfo.name || 'Account Holder',
        isDefault
      };
    } else if (methodType === 'bank') {
      if (!bankForm.accountNumber) {
        alert('Please enter your bank account number');
        return;
      }
      const last4 = bankForm.accountNumber.slice(-4) || '1234';
      newMethod = {
        id: newId,
        type: 'bank',
        brand: 'Bank',
        title: `${bankForm.bankName} (A/C •••• ${last4})`,
        subtitle: `IFSC: ${bankForm.ifsc || 'HDFC0001234'}`,
        holderName: bankForm.accountName || userInfo.name || 'Account Holder',
        isDefault
      };
    }

    if (newMethod) {
      let updated = [...paymentMethods];
      if (isDefault) {
        updated = updated.map(m => ({ ...m, isDefault: false }));
      }
      updated.push(newMethod);
      savePaymentMethodsToStorage(updated);

      // Reset form
      setCardForm({ holderName: '', number: '', expiry: '', cvv: '' });
      setUpiForm({ upiId: '', provider: 'Google Pay' });
      setBankForm({ accountName: '', bankName: 'HDFC Bank', accountNumber: '', ifsc: '' });
      setIsDefault(false);
      setShowAddModal(false);
      alert('🎉 Payment Method added successfully!');
    }
  };

  // Set Default Method
  const handleSetDefault = (id) => {
    const updated = paymentMethods.map(m => ({
      ...m,
      isDefault: m.id === id
    }));
    savePaymentMethodsToStorage(updated);
  };

  // Delete Method
  const handleDeleteMethod = (id) => {
    if (confirm('Are you sure you want to remove this saved payment method?')) {
      const updated = paymentMethods.filter(m => m.id !== id);
      savePaymentMethodsToStorage(updated);
    }
  };

  // Execute Invoice Payment
  const handlePayInvoice = async (inv) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    setProcessingPay(true);
    await new Promise(r => setTimeout(r, 1200));

    if (selectedInvoice) {
      setInvoices(prev => prev.map(item => 
        item.id === selectedInvoice.id ? { ...item, status: 'Paid' } : item
      ));
      setTotalOutstanding(prev => Math.max(0, prev - (selectedInvoice.amountNum || 150)));
    } else {
      // Pay all outstanding
      setInvoices(prev => prev.map(item => ({ ...item, status: 'Paid' })));
      setTotalOutstanding(0);
    }

    setProcessingPay(false);
    setPayModalOpen(false);
    alert('🎉 Payment processed and receipt generated successfully!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Billing & Payments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your invoices, payment methods, and hospital settlement history.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg shadow-sm font-medium border-0 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" /> Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Outstanding Balance Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outstanding</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                totalOutstanding > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {totalOutstanding > 0 ? 'Payment Due' : 'All Cleared'}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ₹{totalOutstanding}
            </div>
            <p className="text-xs text-slate-500">
              {totalOutstanding > 0 ? 'Consultation & lab diagnostics fee pending' : 'No outstanding balances on your clinical account'}
            </p>
          </div>

          <div className="pt-6">
            <Button 
              onClick={() => {
                setSelectedInvoice(null);
                setPayModalOpen(true);
              }}
              disabled={totalOutstanding === 0}
              className="w-full bg-[#0f6c4f] hover:bg-emerald-800 text-white rounded-lg shadow-sm font-medium border-0 h-10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" /> Pay Outstanding (₹{totalOutstanding})
            </Button>
          </div>
        </div>

        {/* Saved Payment Methods Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#0f6c4f]" /> Saved Payment Methods
              </h3>
              <p className="text-xs text-slate-400 font-medium">Cards and UPI VPAs linked for fast 1-click checkout</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#0f6c4f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add New
            </button>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    m.isDefault 
                      ? 'border-emerald-200 bg-[#f0f9f5]' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`h-10 w-12 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                      m.type === 'card' 
                        ? 'bg-[#0f6c4f] text-white' 
                        : m.type === 'upi' 
                        ? 'bg-purple-700 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {m.type === 'card' ? <CreditCard className="h-5 w-5" /> : m.type === 'upi' ? <Smartphone className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-800">{m.title}</p>
                        {m.isDefault && (
                          <span className="bg-[#0f6c4f] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{m.subtitle} • <span className="text-slate-400">{m.holderName}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!m.isDefault && (
                      <button
                        onClick={() => handleSetDefault(m.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0f6c4f] hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMethod(m.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove method"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border-dashed border-2 border-slate-100 rounded-xl">
              <CreditCard className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">No payment methods saved yet</p>
              <Button onClick={() => setShowAddModal(true)} size="sm" className="mt-3 bg-[#0f6c4f] text-white text-xs rounded-lg cursor-pointer">
                + Add First Method
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Invoices History Table */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Invoices & Settlement History</h2>
          <p className="text-xs text-slate-500">Download digital invoices and review consultation fee details.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/75 text-slate-500 border-b border-slate-100 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Invoice / Service</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-lg ${inv.status === 'Paid' ? 'bg-emerald-50 text-[#0f6c4f]' : 'bg-amber-50 text-amber-700'} flex items-center justify-center shrink-0`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs sm:text-sm">{inv.service}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-slate-400">{inv.id}</span>
                              <span className="text-[11px] text-slate-400">• {inv.date}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {inv.amount}
                      </td>
                      <td className="px-6 py-4">
                        {inv.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0f6c4f] border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="h-3.5 w-3.5" /> Due ({inv.dueDate})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {inv.status === 'Unpaid' && (
                            <Button 
                              size="sm" 
                              onClick={() => handlePayInvoice(inv)}
                              className="h-8 px-3 bg-[#0f6c4f] hover:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-sm cursor-pointer"
                            >
                              💳 Pay Now
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alert(`📥 Downloading PDF receipt for ${inv.id}...`)}
                            className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5 mr-1" /> Receipt
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs font-semibold text-slate-400">
                      No invoices recorded on your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD PAYMENT METHOD MODAL                                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-[#f0f9f5]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#0f6c4f] text-white flex items-center justify-center font-bold shadow-xs">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Add Payment Method</h2>
                    <p className="text-xs text-slate-500">Save your card, UPI VPA, or bank account</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-200/50 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddNewMethod} className="p-6 space-y-4">
                
                {/* Method Type Selector */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMethodType('card')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      methodType === 'card' ? 'bg-white text-[#0f6c4f] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethodType('upi')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      methodType === 'upi' ? 'bg-white text-[#0f6c4f] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" /> UPI ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethodType('bank')}
                    className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      methodType === 'bank' ? 'bg-white text-[#0f6c4f] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" /> Bank A/C
                  </button>
                </div>

                {/* CARD FORM */}
                {methodType === 'card' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Cardholder Name</label>
                      <Input
                        type="text"
                        required
                        value={cardForm.holderName}
                        onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                        placeholder="e.g. Mahendra Yadav"
                        className="h-10 rounded-lg text-xs bg-slate-50/50 border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Card Number</label>
                      <Input
                        type="text"
                        required
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4532 8921 4432 8921"
                        className="h-10 rounded-lg text-xs font-mono bg-slate-50/50 border-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Expiry Date</label>
                        <Input
                          type="text"
                          required
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="h-10 rounded-lg text-xs text-center font-mono bg-slate-50/50 border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">CVV</label>
                        <Input
                          type="password"
                          required
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="•••"
                          className="h-10 rounded-lg text-xs text-center font-mono bg-slate-50/50 border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI FORM */}
                {methodType === 'upi' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">UPI Provider</label>
                      <select
                        value={upiForm.provider}
                        onChange={(e) => setUpiForm({ ...upiForm, provider: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50/50 text-slate-700"
                      >
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Virtual Payment Address (UPI ID)</label>
                      <Input
                        type="text"
                        required
                        value={upiForm.upiId}
                        onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                        placeholder="username@okhdfcbank / mobile@ybl"
                        className="h-10 rounded-lg text-xs font-mono bg-slate-50/50 border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {/* BANK FORM */}
                {methodType === 'bank' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Account Holder Name</label>
                      <Input
                        type="text"
                        required
                        value={bankForm.accountName}
                        onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                        placeholder="e.g. Mahendra Yadav"
                        className="h-10 rounded-lg text-xs bg-slate-50/50 border-slate-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Bank Name</label>
                        <select
                          value={bankForm.bankName}
                          onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                          className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-medium bg-slate-50/50 text-slate-700"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">IFSC Code</label>
                        <Input
                          type="text"
                          value={bankForm.ifsc}
                          onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                          placeholder="HDFC0001234"
                          className="h-10 rounded-lg text-xs uppercase font-mono bg-slate-50/50 border-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Account Number</label>
                      <Input
                        type="text"
                        required
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        placeholder="50100492819281"
                        className="h-10 rounded-lg text-xs font-mono bg-slate-50/50 border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {/* Default checkbox */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0f6c4f] focus:ring-[#0f6c4f]"
                  />
                  <span className="text-xs font-medium text-slate-700">Set as default payment method</span>
                </label>

                {/* Footer Buttons */}
                <div className="pt-3 flex gap-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-10 rounded-lg font-medium border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 rounded-lg font-semibold bg-[#0f6c4f] hover:bg-emerald-800 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-4 w-4" /> Save Method
                  </Button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* PAYMENT SETTLEMENT MODAL                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {payModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#0f6c4f] text-white flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">Clear Hospital Dues</h3>
                    <p className="text-[11px] text-slate-400">256-bit Encrypted Settlement</p>
                  </div>
                </div>
                <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#f0f9f5] border border-emerald-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payable Amount</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{selectedInvoice ? selectedInvoice.amountNum : totalOutstanding}
                  </span>
                </div>
                <Badge className="bg-[#0f6c4f] text-white text-[10px]">Instant Clearance</Badge>
              </div>

              {/* Choose Saved Method */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Select Payment Method</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {paymentMethods.map((m, idx) => (
                    <div 
                      key={m.id} 
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer ${
                        idx === 0 ? 'border-[#0f6c4f] bg-[#f0f9f5]' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {m.type === 'card' ? <CreditCard className="h-4 w-4 text-[#0f6c4f]" /> : <Smartphone className="h-4 w-4 text-purple-600" />}
                        <div>
                          <p className="text-xs font-bold text-slate-800">{m.title}</p>
                          <p className="text-[10px] text-slate-400">{m.subtitle}</p>
                        </div>
                      </div>
                      {idx === 0 && <Check className="h-4 w-4 text-[#0f6c4f]" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setPayModalOpen(false)} className="flex-1 rounded-lg font-medium border-slate-200 cursor-pointer">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={processingPay}
                  className="flex-1 rounded-lg font-semibold bg-[#0f6c4f] hover:bg-emerald-800 text-white shadow-sm cursor-pointer"
                >
                  {processingPay ? 'Authorizing...' : `Pay ₹${selectedInvoice ? selectedInvoice.amountNum : totalOutstanding}`}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
