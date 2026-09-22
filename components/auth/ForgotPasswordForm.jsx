'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle2, RefreshCw, ChevronRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setStep(2);
      setTimeLeft(60);
      toast.success('OTP sent to your email');
    } catch (err) {
      const msg = err?.response?.data?.error || 'User not found. Please enter a correct email.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setTimeLeft(60);
      toast.success('OTP resent successfully');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to resend OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple chars
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to focus previous
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (pastedNumbers.length === 0) return;

    const newOtp = [...otp];
    pastedNumbers.split('').forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input
    const nextFocusIndex = Math.min(pastedNumbers.length - 1, 3);
    if (nextFocusIndex >= 0) {
      otpRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      toast.error('Please enter the complete 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/verify-otp', { email, otp: otpValue });
      setStep(3);
      toast.success('OTP verified successfully');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Invalid or expired OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 3) {
      toast.error('Password must be at least 3 characters long');
      return;
    }
    
    // Optional: Check if confirm password matches if you added that field, 
    // but for now we'll stick to the requirement of "next new password input page"
    
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { 
        email, 
        otp: otp.join(''), 
        newPassword 
      });
      setStep(4);
      toast.success('Password reset successfully');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to reset password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 font-sans">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="space-y-1 text-center pb-6">
                  <div className="mx-auto bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-fit mb-2">
                    <KeyRound className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Forgot Password?</CardTitle>
                  <CardDescription>
                    Enter your email to receive a 4-digit verification code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="pl-9 h-11 bg-background border-border focus:bg-background transition-all"
                          autoFocus
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-11 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" /> Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send OTP <ChevronRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    <div className="text-center pt-2">
                      <Link 
                        href="/login" 
                        className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back to Login
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="space-y-1 text-center pb-6">
                  <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full w-fit mb-2">
                    <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Verify OTP</CardTitle>
                  <CardDescription>
                    Enter the 4-digit code sent to <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-14 h-14 text-center text-2xl font-bold bg-background border-border focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-xl shadow-sm"
                        />
                      ))}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                        </span>
                      ) : (
                        'Verify Code'
                      )}
                    </Button>

                    <div className="text-center space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Didn't receive code?{' '}
                        {timeLeft > 0 ? (
                          <span className="text-muted-foreground font-medium">Resend in {timeLeft}s</span>
                        ) : (
                          <button 
                            type="button"
                            onClick={handleResendOtp}
                            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all"
                          >
                            Resend Email
                          </button>
                        )}
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center w-full transition-colors"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" /> Change Email
                      </button>
                    </div>
                  </form>
                </CardContent>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="space-y-1 text-center pb-6">
                  <div className="mx-auto bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full w-fit mb-2">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">New Password</CardTitle>
                  <CardDescription>
                    Create a strong password for your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="New password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="pl-9 h-11 bg-background border-border focus:bg-background transition-all"
                          autoFocus
                          required
                          minLength={3}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full h-11 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" /> Resetting...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="h-20 w-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center shadow-inner"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Password Reset!</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      Your password has been successfully updated. You can now log in with your new password.
                    </p>
                  </div>

                  <Button asChild className="w-full h-11 shadow-lg transition-all mt-4">
                    <Link href="/login">Return to Login</Link>
                  </Button>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
