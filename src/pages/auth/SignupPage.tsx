import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSignup, type SignupRole } from '@/features/auth/useSignup';

type Role = SignupRole;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: Role | '';
  jobTitle: string;
}

const initialForm: SignupForm = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: '',
  jobTitle: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const roleOptions: Array<{ label: string; value: Role }> = [
  { label: '리더', value: 'LEADER' },
  { label: '멤버', value: 'MEMBER' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useSignup();
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage('');
    setMessageType(null);
  };

  const validateForm = () => {
    const { name, email, password, passwordConfirm, role } = form;

    if (!name.trim() || !email.trim() || !password || !passwordConfirm || !role) {
      return '모든 내용을 입력해주세요.';
    }

    if (!emailPattern.test(email.trim())) {
      return '올바른 이메일 형식을 입력해주세요.';
    }

    if (!passwordPattern.test(password)) {
      return '비밀번호는 8자 이상, 영문·숫자·특수문자를 포함해야 합니다.';
    }

    if (password !== passwordConfirm) {
      return '비밀번호와 비밀번호 확인 내용이 일치하지 않습니다.';
    }

    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setMessage(validationMessage);
      setMessageType('error');
      return;
    }

    setMessage('');
    setMessageType(null);

    try {
      if (!form.role) {
        throw new Error('Role is required');
      }

      const authUser = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        jobTitle: form.jobTitle,
      });

      if (authUser) {
        navigate(authUser.role === 'leader' ? '/leader/team-setup' : '/member/team-join');
      } else {
        setMessage('가입이 성공하였습니다!');
        setMessageType('success');
        window.setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원 가입에 실패했습니다.';
      setMessage(message);
      setMessageType('error');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-normal text-black">회원가입</h1>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">이름</span>
            <Input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="이름을 입력하세요"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">이메일</span>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">비밀번호</span>
            <Input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-400">8자 이상, 영문·숫자·특수문자를 포함해야 합니다.</p>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">비밀번호 확인</span>
            <Input
              type="password"
              value={form.passwordConfirm}
              onChange={(event) => updateField('passwordConfirm', event.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
          </label>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-gray-800">역할 선택</legend>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => (
                <label
                  key={role.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    form.role === role.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.role === role.value}
                    onChange={() => updateField('role', role.value)}
                    className="sr-only"
                  />
                  {role.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">직무</span>
            <Input
              type="text"
              value={form.jobTitle}
              onChange={(event) => updateField('jobTitle', event.target.value)}
              placeholder="직무를 입력하세요"
              autoComplete="organization-title"
            />
          </label>

          {message && (
            <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </form>
      </section>
    </main>
  );
}
