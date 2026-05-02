import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '../../hooks/useToast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      dispatch(loginSuccess({
        user: data.user as never,
        tokens: data.tokens,
      }));
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">

          <h1 className="text-4xl font-bold mb-4 font-[var(--font-heading)]">
            Manage your properties<br />with confidence.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Track leases, collect payments, and keep your tenants happy - all in one place.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden auth-right-panel" style={{ backgroundColor: '#0f1623', minHeight: '100vh' }}>
        <style>{`
          .auth-right-panel label { color: rgba(255, 255, 255, 0.55) !important; font-size: 13px !important; }
        `}</style>

        {/* Top-right 'R' logo mark */}
        <div style={{
          position: 'absolute',
          top: '32px',
          right: '36px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          R
        </div>

        {/* Glow Effects */}
        <div 
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '650px', height: '650px',
            background: 'radial-gradient(circle at center, rgba(59, 91, 219, 0.28) 0%, transparent 70%)',
            transform: 'translate(20%, -20%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            width: '500px', height: '500px',
            background: 'radial-gradient(circle at center, rgba(99, 60, 180, 0.10) 0%, transparent 70%)',
            transform: 'translate(-20%, 20%)'
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md relative z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '40px 36px'
          }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <span className="text-xl font-bold text-white">RentFlow</span>
          </div>

          <h2 className="text-white" style={{ fontSize: '28px', fontWeight: 600, marginBottom: '6px' }}>
            Welcome back
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', marginBottom: '32px' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={16} color="rgba(255,255,255,0.45)" />}
              className="!bg-[rgba(255,255,255,0.06)] !border-[rgba(255,255,255,0.10)] focus:!ring-0 focus:!outline-none focus:!shadow-[0_0_0_3px_rgba(59,91,219,0.25)] !text-white placeholder:!text-[rgba(255,255,255,0.3)] transition-all"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={16} color="rgba(255,255,255,0.45)" />}
                className="!bg-[rgba(255,255,255,0.06)] !border-[rgba(255,255,255,0.10)] focus:!ring-0 focus:!outline-none focus:!shadow-[0_0_0_3px_rgba(59,91,219,0.25)] !text-white placeholder:!text-[rgba(255,255,255,0.3)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/40 hover:text-white/80 transition-colors"
                style={{ marginTop: '2px' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full mt-2" 
              style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)' }}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.45)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
