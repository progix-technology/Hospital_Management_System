import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Card, CardContent } from '../../../components/Card';
import { ArrowLeft, Save, User, UserCheck, Stethoscope, Lock } from 'lucide-react';

export default function AddDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    gender: 'Male',
    phone: '',
    address: '',
    // Role selection
    role: 'doctor',
    // Professional Details
    specialty: '',
    degree: '',
    experience: '',
    licenseNo: '',
    // Login Credentials
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const isTech = formData.role === 'lab_technician';
      const namePrefix = isTech ? '' : 'Dr. ';
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${namePrefix}${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          gender: formData.gender,
          specialty: isTech ? 'Laboratory Tech' : formData.specialty
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register staff');
      }

      // Automatically navigate on success
      navigate('/admin/doctors');
    } catch (error) {
      console.error('Error adding staff:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/doctors">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add New Doctor</h2>
            <p className="text-[var(--color-muted-foreground)] text-sm mt-1">Enter complete details to onboard a new doctor</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate('/admin/doctors')}>Cancel</Button>
          <Button className="flex-1 sm:flex-none bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Doctor'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2 bg-[var(--color-muted)]/20 rounded-t-2xl">
              <User className="h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="font-semibold text-lg">Personal Details</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role *</label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="lab_technician">Lab Technician</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea 
                    name="address" 
                    rows="3"
                    className="flex w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 resize-none"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2 bg-[var(--color-muted)]/20 rounded-t-2xl">
              <Stethoscope className="h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="font-semibold text-lg">Professional Details</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialty *</label>
                  <select 
                    name="specialty" 
                    value={formData.specialty} 
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  >
                    <option value="">Select Specialty</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="ENT">ENT (Ear, Nose, Throat)</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Gynecology">Gynecology & Obstetrics</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="General Physician">General Physician / Practice</option>
                    <option value="Urology">Urology</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Pathology & Laboratory">Pathology & Laboratory</option>
                    <option value="Radiology">Radiology & Imaging</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree/Qualification *</label>
                  <Input name="degree" placeholder="e.g. MBBS, MD" value={formData.degree} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Years of Experience</label>
                  <Input name="experience" type="number" min="0" placeholder="e.g. 10" value={formData.experience} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical License No. *</label>
                  <Input name="licenseNo" placeholder="Enter License Number" value={formData.licenseNo} onChange={handleChange} required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Login Credentials */}
          <Card className="border-[var(--color-primary)]/30 shadow-md">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2 bg-[var(--color-primary)]/5 rounded-t-2xl">
              <Lock className="h-5 w-5 text-[var(--color-primary)]" />
              <h3 className="font-semibold text-lg">Login Credentials</h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-5">
                <p className="text-sm text-[var(--color-muted-foreground)] mb-2">
                  These credentials will be used by the doctor to log in to the hospital portal.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <Input name="email" type="email" placeholder="doctor@medisphere.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temporary Password *</label>
                  <Input name="password" type="text" placeholder="Generate or type password" value={formData.password} onChange={handleChange} required />
                  <p className="text-[10px] text-emerald-600 mt-1 flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" /> The doctor will be prompted to change this on their first login.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </motion.div>
  );
}
