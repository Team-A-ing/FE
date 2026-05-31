import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/features/auth/useLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다');
      return;
    }

    try {
      const user = await login({ email, password });
      if (user.teamId === '') {
        navigate(user.role === 'leader' ? '/leader/team-setup' : '/member/team-join');
      } else {
        navigate(user.role === 'leader' ? ROUTES.LEADER_MEETINGS : ROUTES.MEMBER_MEETINGS);
      }
    } catch {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-normal text-black">READB</h1>
          <p className="mt-4 text-sm text-gray-500">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-medium text-black underline-offset-4 hover:underline">
              회원가입
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">이메일</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">비밀번호</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
          </label>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </section>
    </main>
  );
}
