import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useCreateTeam } from '@/features/team/useCreateTeam';

export default function TeamSetupPage() {
  const navigate = useNavigate();
  const { create, isLoading, error } = useCreateTeam();
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = teamName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) return;
    try {
      const code = await create(trimmed);
      setInviteCode(code);
      setModalOpen(true);
    } catch {
      // error is set in hook
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate('/leader/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-black">팀 만들기</h1>
        <p className="mb-8 text-center text-sm text-gray-500">팀 이름을 입력하고 팀을 생성하세요.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">팀 이름</span>
            <Input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀 이름을 입력하세요 (2~30자)"
              minLength={2}
              maxLength={30}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading || teamName.trim().length < 2}>
            {isLoading ? '생성 중...' : '팀 생성하기'}
          </Button>
        </form>

        <Modal open={modalOpen} onClose={() => {}}>
          <h2 className="mb-4 text-lg font-bold text-black">팀이 생성되었습니다!</h2>
          <p className="mb-2 text-sm text-gray-600">아래 초대 코드를 팀원에게 공유하세요.</p>
          <button
            type="button"
            onClick={handleCopy}
            className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center font-mono text-lg font-semibold tracking-widest text-black hover:bg-gray-100"
          >
            {inviteCode}
          </button>
          {copied && <p className="mb-2 text-center text-xs text-green-600">클립보드에 복사되었습니다.</p>}
          <Button className="w-full" onClick={handleConfirm}>
            확인
          </Button>
        </Modal>
      </section>
    </main>
  );
}
