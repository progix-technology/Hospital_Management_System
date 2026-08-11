import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Phone, Mail, MessageSquare, FileText, ChevronRight, HelpCircle } from 'lucide-react';

export default function PatientSupport() {
  const faqs = [
    {
      q: 'How do I reschedule my appointment?',
      a: 'You can reschedule any upcoming appointment from the Appointments tab. Click the "Reschedule" button next to your appointment and select a new time slot.'
    },
    {
      q: 'When will my lab results be available?',
      a: 'Most standard lab results are available within 24-48 hours. You will receive an email notification when they are ready to view in your Medical Records tab.'
    },
    {
      q: 'How do I request a prescription refill?',
      a: 'Navigate to the Prescriptions tab and click "Request Refill" next to your active medication. Please allow up to 48 hours for provider approval.'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Support & Help Center</h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">We're here to help. Find answers or get in touch with our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Cards */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-foreground)]">Live Chat</h3>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Chat with our support team</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-foreground)]">Call Us</h3>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">+1 (800) 123-4567</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-foreground)]">Email Support</h3>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">support@medisphere.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ & Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--color-primary)]" /> Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                  <h4 className="font-semibold text-[var(--color-foreground)] flex items-start gap-2">
                    <span className="text-[var(--color-primary)] font-bold">Q.</span> {faq.q}
                  </h4>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-2 leading-relaxed ml-6">{faq.a}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[var(--color-primary)] justify-center mt-2">
                View All FAQs <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">Subject</label>
                <Input placeholder="What do you need help with?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-foreground)]">Message</label>
                <textarea 
                  className="w-full min-h-[120px] p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>
              <Button className="w-full md:w-auto">Send Message</Button>
            </CardContent>
          </Card>
        </div>

      </div>

    </motion.div>
  );
}
