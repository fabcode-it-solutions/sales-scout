'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Lock, LogOut, Key, CheckCircle, Fingerprint } from 'lucide-react';

import { toast } from 'sonner';

export default function UserProfile() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 3) {
      toast.error('Password must be at least 3 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post('/api/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Get initials for avatar
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center sm:text-left sm:flex sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your profile and security preferences.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Quick Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Fingerprint size={120} />
              </div>
              <CardContent className="pt-10 flex flex-col items-center text-center relative z-10">
                <div className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold mb-6 ring-4 ring-white/10 shadow-2xl">
                  {initials}
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
                <p className="text-blue-100 text-sm mt-1 mb-8 flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </p>
                
                <div className="w-full bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100 flex items-center gap-2">
                      <Shield size={14} /> Role
                    </span>
                    <span className="font-semibold bg-white/20 px-3 py-1 rounded-full capitalize text-xs tracking-wide shadow-sm">
                      {user.role}
                    </span>
                  </div>
                  <div className="w-full border-t border-white/10 my-3"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100 flex items-center gap-2">
                      <CheckCircle size={14} /> Status
                    </span>
                    <span className="font-semibold bg-green-500/20 text-green-100 px-3 py-1 rounded-full text-xs tracking-wide shadow-sm border border-green-500/30">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                   <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                     <LogOut size={18} className="text-muted-foreground" />
                     Sign Out
                   </h3>
                   <p className="text-sm text-muted-foreground mb-4">Securely log out of your account on this device.</p>
                   <Button 
                    variant="default" 
                    onClick={handleLogout}
                    className="w-full shadow-sm hover:shadow-md transition-all bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <Card className="border-border shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <User className="text-primary" size={20} />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic profile information used across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <User size={14} /> Full Name
                    </label>
                    <div className="flex items-center px-3 py-2.5 bg-muted/50 rounded-lg border border-border text-foreground font-medium shadow-sm">
                      {user.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail size={14} /> Email Address
                    </label>
                    <div className="flex items-center px-3 py-2.5 bg-muted/50 rounded-lg border border-border text-foreground font-medium shadow-sm">
                      {user.email}
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Fingerprint size={14} /> User ID
                    </label>
                    <div className="flex items-center px-3 py-2.5 bg-muted/50 rounded-lg border border-border text-muted-foreground font-mono text-xs shadow-sm">
                      {user.id}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="border-border shadow-md">
              <CardHeader className="border-b border-border bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="text-primary" size={20} />
                  Security
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Current Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        value={passwordForm.oldPassword}
                        onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                        required
                        className="pl-9 bg-background"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          required
                          minLength={3}
                          className="pl-9 bg-background"
                          placeholder="Min 3 chars"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          required
                          minLength={3}
                          className="pl-9 bg-background"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isChangingPassword}
                      className="w-full sm:w-auto shadow-sm"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
