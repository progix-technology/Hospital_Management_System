import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">Reset Password</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-foreground)]">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[var(--color-muted-foreground)]" />
            <Input type="email" placeholder="doctor@medisphere.com" className="pl-10" />
          </div>
        </div>

        <Button className="w-full h-12 text-base group">
          Send Reset Link
          <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>
    </motion.div>
  );
}
