import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Card, CardContent } from '../../../components/Card';
import { ArrowLeft, Save, User, UserCheck, Stethoscope, Lock } from 'lucide-react';
import axios from 'axios';

export default function EditDoctor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    gender: 'Male',
    phone: '',
    address: '',
    // Professional Details
    specialty: '',
    degree: '',
    experience: '',
    licenseNo: '',
    // Login Credentials
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setFetchLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`);

        // Split name: remove "Dr. " prefix if present
        const cleanName = data.name?.replace(/^Dr\.\s*/i, '') || '';
        const nameParts = cleanName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          gender: data.gender || 'Male',
          phone: data.phone || '',
          address: data.address?.street || '',
          specialty: data.specialty || '',
          email: data.email || '',
        }));
      } catch (err) {
        setError('Failed to load doctor details.');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const isDoctor = true; // editing from doctor admin page
      const payload = {
        name: `Dr. ${formData.firstName} ${formData.lastName}`.trim(),
        gender: formData.gender,
        phone: formData.phone,
        specialty: formData.specialty,
        address: { street: formData.address },
        ...(formData.email && { email: formData.email }),
        ...(formData.password && { newPassword: formData.password }),
      };

      await axios.put(`http://localhost:5000/api/users/profile/${id}`, payload);
      setSuccess('Doctor details updated successfully!');
      setTimeout(() => navigate('/admin/doctors'), 1200);
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError(err.response?.data?.message || 'Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-r-transparent mb-3" />
        <p className="text-sm text-[var(--color-muted-foreground)]">Loading doctor details...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-10">

      {/* Success / Error banners */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          ❌ {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/doctors">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Doctor</h2>
            <p className="text-[var(--color-muted-foreground)] text-sm mt-1">Update details for doctor {id}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate('/admin/doctors')}>Cancel</Button>
          <Button className="flex-1 sm:flex-none bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90" onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? 'Updating...' : 'Update Doctor'}
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
                  <Input name="firstName" placeholder="Ritik " value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input name="lastName" placeholder="Pandey" value={formData.lastName} onChange={handleChange} required />
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
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
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
                  <label className="text-sm font-medium">Degree/Qualification</label>
                  <Input name="degree" placeholder="e.g. MBBS, MD" value={formData.degree} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Years of Experience</label>
                  <Input name="experience" type="number" min="0" placeholder="e.g. 10" value={formData.experience} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical License No.</label>
                  <Input name="licenseNo" placeholder="Enter License Number" value={formData.licenseNo} onChange={handleChange} />
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
                  These credentials will be used by the doctor to log in. Update only if necessary.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input name="email" type="email" placeholder="doctor@medisphere.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input name="password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </motion.div>
  );
}
