import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PatientInsurance() {
  const policies = [
    {
      id: 1,
      provider: 'BlueCross Premium',
      policyNumber: 'BC-9982-1102-44X',
      groupNumber: 'GRP-10029',
      type: 'Primary',
      coverage: 'Comprehensive Health & Dental',
      status: 'Active',
      copay: {
        pcp: '$20',
        specialist: '$40',
        er: '$150'
      }
    }
  ];

  const claims = [
    {
      id: 'CLM-00921',
      date: 'Oct 20, 2026',
      service: 'Cardiology Consultation',
      provider: 'Dr. Sarah Smith',
      billed: '$350.00',
      covered: '$330.00',
      patientResponsibility: '$20.00',
      status: 'Approved'
    },
    {
      id: 'CLM-00918',
      date: 'Sep 15, 2026',
      service: 'Comprehensive Blood Panel',
      provider: 'Medisphere Labs',
      billed: '$150.00',
      covered: '$150.00',
      patientResponsibility: '$0.00',
      status: 'Approved'
    },
    {
      id: 'CLM-00940',
      date: 'Nov 02, 2026',
      service: 'MRI Scan',
      provider: 'Medisphere Imaging',
      billed: '$1200.00',
      covered: '$0.00',
      patientResponsibility: 'Pending',
      status: 'Processing'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Insurance & Coverage</h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">Manage your health insurance policies and track claims.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload New Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Policies */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Active Policies</h2>
          {policies.map((policy) => (
            <Card key={policy.id} className="overflow-hidden border-[var(--color-primary)]">
              <div className="bg-[var(--color-primary)]/5 p-4 border-b border-[var(--color-border)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--color-foreground)]">{policy.provider}</h3>
                    <Badge variant="outline" className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-transparent">{policy.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>{policy.status}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Policy Details</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Member ID:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Group Number:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.groupNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Coverage:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.coverage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">Standard Copays</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Primary Care:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.copay.pcp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Specialist:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.copay.specialist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Emergency Room:</span>
                        <span className="text-sm font-medium text-[var(--color-foreground)]">{policy.copay.er}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="w-full">View ID Card</Button>
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Summary Widget */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Benefits Summary</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">In-Network Deductible</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">$450 spent of $1,000</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary)]">45%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">Out-of-Pocket Maximum</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">$850 spent of $4,500</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary)]">18%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-foreground)] mb-4">Recent Claims</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Claim Info</th>
                    <th className="px-6 py-4 font-semibold">Billed</th>
                    <th className="px-6 py-4 font-semibold">Covered</th>
                    <th className="px-6 py-4 font-semibold">You Pay</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-[var(--color-muted)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg ${claim.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center shrink-0`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-foreground)]">{claim.service}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">{claim.id} • {claim.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--color-muted-foreground)]">
                        {claim.billed}
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600">
                        {claim.covered}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[var(--color-foreground)]">
                        {claim.patientResponsibility}
                      </td>
                      <td className="px-6 py-4">
                        {claim.status === 'Approved' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </Badge>
                        ) : claim.status === 'Processing' ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 gap-1">
                            <Clock className="h-3 w-3" /> Processing
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1">
                            <AlertCircle className="h-3 w-3" /> Denied
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

    </motion.div>
  );
}
