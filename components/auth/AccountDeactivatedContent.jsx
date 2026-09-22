'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function AccountDeactivatedContent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md text-center border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-destructive">Account Deactivated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your account has been deactivated by the administrator. You cannot access the platform at this time.
          </p>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error or would like to request reactivation, please contact support.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
