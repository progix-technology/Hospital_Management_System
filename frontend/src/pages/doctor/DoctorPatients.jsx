import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Phone, Mail, Activity, ChevronRight, Heart, Droplet, Scale, ActivitySquare, Save } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/users/patients');
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = Array.isArray(patients) ? patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">My Patients</h2>
          <p className="text-[var(--color-muted-foreground)]">Manage patients and record their vitals.</p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="bg-[var(--color-background-secondary)]/50 border-none shadow-none">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder="Search patients by name..."
              className="pl-10 h-11 bg-[var(--color-card)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 bg-[var(--color-card)]">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </CardContent>
      </Card>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-[var(--color-muted-foreground)]">Loading patients...</div>
        ) : filteredPatients.length > 0 ? filteredPatients.map((patient, i) => (
          <motion.div
            key={patient._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="group hover:border-[var(--color-primary)]/40 transition-all hover:shadow-md h-full flex flex-col">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center text-xl text-[var(--color-primary)] font-bold shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{patient.name}</h3>
                      <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1">{patient.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 mt-4 bg-[var(--color-background-secondary)] rounded-xl p-3 border border-[var(--color-border)]">
                  <h4 className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity className="h-3 w-3" /> Current Vitals</h4>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-foreground)]">BP:</span>
                      <span className="font-medium">{patient.vitals?.bloodPressure || '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-foreground)]">HR:</span>
                      <span className="font-medium">{patient.vitals?.heartRate || '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-foreground)]">Weight:</span>
                      <span className="font-medium">{patient.vitals?.weight || '--'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-foreground)]">Sugar:</span>
                      <span className="font-medium">{patient.vitals?.sugarLevel || '--'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full text-[var(--color-primary)] bg-[var(--color-primary)]/5 border-none"><Phone className="h-4 w-4" /></Button>
                  </div>
                  <Link to={`/doctor/patients/${patient._id}`}>
                    <Button size="sm" className="bg-[var(--color-foreground)] text-[var(--color-background)] hover:bg-[var(--color-foreground)]/90">
                      <ActivitySquare className="mr-1.5 h-4 w-4" /> View Profile & Vitals
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-[var(--color-muted-foreground)]">
            No patients found matching "{searchTerm}"
          </div>
        )}
      </div>

    </motion.div>
  );
}
