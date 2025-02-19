'use client';

import type React from 'react';

import { useState } from 'react';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
}

export function EmailVerification({
  email,
  onVerificationComplete,
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      if (isSignUpComplete) {
        toast({
          title: 'Success',
          description: 'Your email has been verified successfully.',
        });
        onVerificationComplete();
      } else {
        console.log('Next step:', nextStep);
        toast({
          title: 'Additional Step Required',
          description: 'Please complete the next step to finish signup.',
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast({
        title: 'Error',
        description:
          'Failed to verify email. Please check the code and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email is required to resend verification email.',
        variant: 'destructive',
      });
      return;
    }
    try {
      console.log('Resending verification code to:', email);
      await resendSignUpCode({ username: email });
      toast({
        title: 'Verification Email Sent',
        description:
          'A new verification email has been sent to your email address.',
      });
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleVerification} className="space-y-4">
        <div>
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
      <Button
        type="button"
        className="mt-4"
        onClick={handleResendVerification}
        disabled={isLoading}
      >
        Resend Verification Email
      </Button>
    </div>
  );
}
