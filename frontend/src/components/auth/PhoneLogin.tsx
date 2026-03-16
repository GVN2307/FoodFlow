import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, ArrowLeft, Loader2, Info } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface PhoneLoginProps {
    onBack: () => void;
}

export default function PhoneLogin({ onBack }: PhoneLoginProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { handleOtpLoginSuccess } = useAuth() as any; // We'll update the context type next
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Start countdown timer when moving to step 2
    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [step, countdown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/auth/otp/send-otp', { phone });
            setStep(2);
            setCountdown(60); // 60 seconds resend cooldown
            // Focus first OTP input
            setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Allow pasting full code
        if (value.length > 1) {
            const pastedData = value.substring(0, 6).split('');
            for (let i = 0; i < pastedData.length; i++) {
                if (index + i < 6) newOtp[index + i] = pastedData[i];
            }
            setOtp(newOtp);
            // Focus next empty or last input
            const nextEmpty = newOtp.findIndex(val => !val);
            if (nextEmpty !== -1) {
                otpInputRefs.current[nextEmpty]?.focus();
            } else {
                otpInputRefs.current[5]?.focus();
            }
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Auto-focus previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/otp/verify-otp', {
                phone,
                otp: otpCode
            });

            // If we made it here, login/registration was successful
            if (handleOtpLoginSuccess) {
                handleOtpLoginSuccess(response.data);
            }
        } catch (err: any) {
            // If the backend requires a name for a new user, it could return a specific error code
            // We'll simulate this by catching it. For this implementation, the backend creates a dummy name if none provided.
            // But we can still offer step 3 for name collection if needed.
            setError(err.response?.data?.error || 'Invalid or expired OTP');
            // Clear OTP
            setOtp(['', '', '', '', '', '']);
            otpInputRefs.current[0]?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/auth/otp/send-otp', { phone });
            setCountdown(60);
            setOtp(['', '', '', '', '', '']);
            otpInputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Email Login
            </button>

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Mobile Login
                </h2>
                <p className="text-gray-400 mt-2">
                    {step === 1 ? "Enter your mobile number to get an OTP" : "Enter the 6-digit code we sent you"}
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mobile Number</label>
                        <div className="relative flex">
                            <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-zinc-700 bg-zinc-800/80 text-gray-400 sm:text-sm">
                                +91
                            </span>
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="tel"
                                    required
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Numeric only
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-r-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Info className="h-3 w-3 mr-1" /> OTP will be printed in the backend console
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || phone.length !== 10}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Send OTP <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex justify-between">
                            <span>Enter OTP</span>
                            <span className="text-emerald-500">{phone}</span>
                        </label>

                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { otpInputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-xl font-bold bg-zinc-800/50 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Didn't receive the code?</span>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={countdown > 0 || isSubmitting}
                            className={`font-medium ${countdown > 0 ? 'text-gray-500' : 'text-emerald-500 hover:text-emerald-400'}`}
                        >
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || otp.join('').length !== 6}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Verify & Login <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </motion.div>
    );
}
