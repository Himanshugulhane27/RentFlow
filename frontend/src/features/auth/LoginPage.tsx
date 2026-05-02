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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            marginBottom: '20px',
            width: 'max-content'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7da4f5' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
              RentFlow
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4 font-[var(--font-heading)]">
            Manage your properties<br />with confidence.
          </h1>
          <p className="text-lg text-white/70 max-w-md mb-12">
            Track leases, collect payments, and keep your tenants happy - all in one place.
          </p>
          
          <div className="flex items-center gap-8 mt-auto lg:mt-0">
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>2.4k+</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Properties</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>98%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Uptime</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>$12M+</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Rent collected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 auth-right-panel" style={{ position: 'relative', overflow: 'hidden', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{`
          .auth-right-panel label { color: rgba(255,255,255,0.50) !important; font-size: 12px !important; margin-bottom: 7px !important; }
        `}</style>

        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,91,219,0.40) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,60,200,0.25) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '280px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(40,70,180,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative', zIndex: 2, width: '360px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.11)', borderRadius: '20px', padding: '40px 36px', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', marginBottom: '28px' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={16} color="rgba(255,255,255,0.38)" />}
              className="!bg-[rgba(255,255,255,0.05)] !border-[rgba(255,255,255,0.09)] !rounded-[10px] !px-[14px] !py-[10px] !text-white !w-full focus:!outline-none focus:!border-[rgba(59,91,219,0.7)] focus:!shadow-[0_0_0_3px_rgba(59,91,219,0.25)] placeholder:!text-[rgba(255,255,255,0.3)] transition-all"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={16} color="rgba(255,255,255,0.38)" />}
                className="!bg-[rgba(255,255,255,0.05)] !border-[rgba(255,255,255,0.09)] !rounded-[10px] !px-[14px] !py-[10px] !text-white !w-full focus:!outline-none focus:!border-[rgba(59,91,219,0.7)] focus:!shadow-[0_0_0_3px_rgba(59,91,219,0.25)] placeholder:!text-[rgba(255,255,255,0.3)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-white/40 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              style={{ width: '100%', background: 'linear-gradient(135deg,#3563e9,#2347c5)', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 500, color: '#fff', boxShadow: '0 4px 24px rgba(53,99,233,0.45), inset 0 1px 0 rgba(255,255,255,0.15)', cursor: 'pointer', marginTop: '12px' }}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.45)' }}>
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
