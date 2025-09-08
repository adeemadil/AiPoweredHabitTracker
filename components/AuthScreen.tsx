import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Shield,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp, useClerk } from '@clerk/nextjs';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'two-factor' | 'verify-email';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export function AuthScreen({ onSuccess, onBack }: AuthScreenProps) {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });

  // Clerk hooks
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { client } = useClerk();

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[a-z]/)) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^a-zA-Z0-9]/)) score += 25; // Extra points for special chars
    return Math.min(100, score);
  };

  const getPasswordStrengthLabel = (score: number) => {
    if (score === 0) return { label: '', color: '' };
    if (score < 50) return { label: 'Weak', color: 'bg-destructive' };
    if (score < 75) return { label: 'Fair', color: 'bg-yellow-500' };
    if (score < 100) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength(currentView === 'signup' ? signupForm.password : '');
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: loginForm.email,
        password: loginForm.password,
      });

      if (result.status === 'complete') {
        onSuccess();
        setLoginForm({ email: '', password: '' });
      } else if (result.status === 'needs_second_factor') {
        setCurrentView('two-factor');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.errors?.[0]?.message || 'An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded || !signUp) return;
    
    setIsLoading(true);
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: signupForm.email,
        password: signupForm.password,
        firstName: signupForm.name.split(' ')[0],
        lastName: signupForm.name.split(' ').slice(1).join(' ') || '',
      });

      if (result.status === 'complete') {
        // Account ready – sign them in directly
        if (signIn) {
          await signIn.create({ identifier: signupForm.email, password: signupForm.password });
        }
        onSuccess();
        setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
        return;
      }

      // If Clerk requires email verification, start the flow
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCurrentView('verify-email');
      setSuccessMessage('We emailed you a 6‑digit code. Enter it below to verify your account.');
    } catch (err: any) {
      console.error('Signup error:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: forgotPasswordForm.email,
      });

      setSuccessMessage('Password reset email sent! Check your inbox.');
      setForgotPasswordForm({ email: '' });
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.errors?.[0]?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!signInLoaded) return;
    
    setIsLoading(true);
    setError('');

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
    } catch (err: any) {
      console.error(`${provider} login error:`, err);
      setError(err.errors?.[0]?.message || `An error occurred during ${provider} login`);
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    
    setIsLoading(true);
    setError('');

    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: 'totp',
        code: otpCode,
      });

      if (result.status === 'complete') {
        onSuccess();
        setOtpCode('');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.errors?.[0]?.message || 'An unexpected error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const socialButtonVariant = "outline";

  const renderPasswordRequirements = () => (
    <div className="text-sm space-y-1">
      <p className="text-muted-foreground mb-2">Password requirements:</p>
      <div className="flex items-center gap-2">
        {signupForm.password.length >= 8 ? 
          <CheckCircle className="h-3 w-3 text-green-500" /> : 
          <Circle className="h-3 w-3 text-muted-foreground" />
        }
        <span className={signupForm.password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
          At least 8 characters
        </span>
      </div>
      <div className="flex items-center gap-2">
        {signupForm.password.match(/[a-z]/) && signupForm.password.match(/[A-Z]/) ? 
          <CheckCircle className="h-3 w-3 text-green-500" /> : 
          <Circle className="h-3 w-3 text-muted-foreground" />
        }
        <span className={signupForm.password.match(/[a-z]/) && signupForm.password.match(/[A-Z]/) ? 'text-green-600' : 'text-muted-foreground'}>
          Upper & lowercase letters
        </span>
      </div>
      <div className="flex items-center gap-2">
        {signupForm.password.match(/[0-9]/) ? 
          <CheckCircle className="h-3 w-3 text-green-500" /> : 
          <Circle className="h-3 w-3 text-muted-foreground" />
        }
        <span className={signupForm.password.match(/[0-9]/) ? 'text-green-600' : 'text-muted-foreground'}>
          At least one number
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              {(currentView === 'forgot-password' || currentView === 'two-factor') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('login')}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {onBack && currentView === 'login' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-0 h-auto ml-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-4xl mb-4">🌱</div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {currentView === 'login' && 'Welcome back'}
                {currentView === 'signup' && 'Join Habitual'}
                {currentView === 'forgot-password' && 'Reset password'}
                {currentView === 'two-factor' && 'Verify your email'}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {currentView === 'login' && 'Sign in to continue your habit journey'}
                {currentView === 'signup' && 'Start building better habits today'}
                {currentView === 'forgot-password' && 'Enter your email to reset your password'}
                {currentView === 'two-factor' && 'Enter the 6-digit code sent to your email'}
                {currentView === 'verify-email' && 'Enter the verification code sent to your email'}
                {currentView === 'verify-email' && 'Enter the verification code sent to your email'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {currentView === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 h-12 bg-input-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="text-right">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setCurrentView('forgot-password')}
                        className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={socialButtonVariant}
                      onClick={() => handleSocialLogin('oauth_google')}
                      disabled={isLoading}
                      className="h-12"
                    >
                      <div className="w-4 h-4 mr-2">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant={socialButtonVariant}
                      onClick={() => handleSocialLogin('oauth_github')}
                      disabled={isLoading}
                      className="h-12"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setCurrentView('signup')}
                        className="p-0 h-auto text-primary hover:text-primary/80"
                      >
                        Sign up
                      </Button>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* Signup Form */}
              {currentView === 'signup' && (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10 h-12 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 h-12 bg-input-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {signupForm.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={passwordStrength} className="flex-1 h-2" />
                          {strengthInfo.label && (
                            <Badge variant="outline" className={`text-xs px-2 py-0 ${strengthInfo.color.replace('bg-', 'text-')}`}>
                              {strengthInfo.label}
                            </Badge>
                          )}
                        </div>
                        {renderPasswordRequirements()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10 h-12 bg-input-background"
                        required
                      />
                    </div>
                    {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Passwords don't match
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || passwordStrength < 50}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>

                  {/* Debug button - remove after testing */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!signUp) {
                        console.error('signUp is undefined');
                        return;
                      }
                      console.log('Testing basic signup...');
                      try {
                        const result = await signUp.create({
                          emailAddress: 'test@example.com',
                          password: 'TestPassword123!',
                        });
                        console.log('Test signup result:', result);
                      } catch (err) {
                        console.error('Test signup error:', err);
                      }
                    }}
                    className="w-full h-10 text-xs"
                  >
                    Test Basic Signup
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setCurrentView('login')}
                        className="p-0 h-auto text-primary hover:text-primary/80"
                      >
                        Sign in
                      </Button>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* Forgot Password Form */}
              {currentView === 'forgot-password' && (
                <motion.form
                  key="forgot-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordForm.email}
                        onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? 'Sending reset link...' : 'Send reset link'}
                  </Button>
                </motion.form>
              )}

              {/* Two-Factor Authentication */}
              {currentView === 'two-factor' && (
                <motion.form
                  key="two-factor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleOTPVerification}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        We've sent a verification code to
                      </p>
                      <p className="font-medium">{loginForm.email}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <InputOTP value={otpCode} onChange={setOtpCode} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-12" />
                          <InputOTPSlot index={1} className="w-12 h-12" />
                          <InputOTPSlot index={2} className="w-12 h-12" />
                          <InputOTPSlot index={3} className="w-12 h-12" />
                          <InputOTPSlot index={4} className="w-12 h-12" />
                          <InputOTPSlot index={5} className="w-12 h-12" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & continue'}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive a code?{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-primary hover:text-primary/80"
                      >
                        Resend
                      </Button>
                    </p>
                  </div>
                </motion.form>
              )}

              {currentView === 'verify-email' && (
                <motion.div
                  key="verify-email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Enter the 6‑digit code we sent to</p>
                      <p className="font-medium">{signupForm.email}</p>
                    </div>

                    <div className="flex justify-center">
                      <InputOTP value={verificationCode} onChange={setVerificationCode} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-12" />
                          <InputOTPSlot index={1} className="w-12 h-12" />
                          <InputOTPSlot index={2} className="w-12 h-12" />
                          <InputOTPSlot index={3} className="w-12 h-12" />
                          <InputOTPSlot index={4} className="w-12 h-12" />
                          <InputOTPSlot index={5} className="w-12 h-12" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={async () => {
                      if (!verificationCode || verificationCode.length !== 6 || !signUp || !signIn) return;
                      setIsLoading(true);
                      setError('');
                      try {
                        const res = await signUp.attemptEmailAddressVerification({ code: verificationCode });
                        if (res.status === 'complete') {
                          await signIn.create({ identifier: signupForm.email, password: signupForm.password });
                          onSuccess();
                        } else {
                          setError('Verification failed. Please try again.');
                        }
                      } catch (err: any) {
                        console.error('Email verification error:', err);
                        if (err.errors && err.errors.length > 0) {
                          setError(err.errors[0].message);
                        } else if (err.message) {
                          setError(err.message);
                        } else {
                          setError('An unexpected error occurred during verification');
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || verificationCode.length !== 6 || !signUp || !signIn}
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium"
                  >
                    {isLoading ? 'Verifying...' : 'Verify email'}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive a code?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={async () => {
                          if (!signUp) return;
                          try {
                            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                            setSuccessMessage('Code resent. Check your inbox.');
                          } catch (err: any) {
                            console.error('Resend verification error:', err);
                            if (err.errors && err.errors.length > 0) {
                              setError(err.errors[0].message);
                            } else if (err.message) {
                              setError(err.message);
                            } else {
                              setError('Failed to resend code');
                            }
                          }
                        }}
                        disabled={!signUp}
                        className="p-0 h-auto text-primary hover:text-primary/80"
                      >
                        Resend
                      </Button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Shield className="h-4 w-4" />
              <span>Your data is encrypted and safe</span>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}