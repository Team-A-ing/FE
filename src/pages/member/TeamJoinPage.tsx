import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useJoinTeam } from '@/features/team/useJoinTeam';

export default function TeamJoinPage() {
  const navigate = useNavigate();
  const { join, isLoading, error } = useJoinTeam();
  const [inviteCode, setInviteCode] = useState('');
  const [joinedTeamName, setJoinedTeamName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inviteCode.trim();
    if (!trimmed) return;
    try {
      const teamName = await join(trimmed);
      setJoinedTeamName(teamName);
      setModalOpen(true);
    } catch {
      // error is set in hook
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate('/member/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-black">팀 참여하기</h1>
        <p className="mb-8 text-center text-sm text-gray-500">리더에게 받은 초대 코드를 입력하세요.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-800">초대 코드</span>
            <Input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="초대 코드를 입력하세요"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading || !inviteCode.trim()}>
            {isLoading ? '참여 중...' : '참여하기'}
          </Button>
        </form>

        <Modal open={modalOpen} onClose={() => {}}>
          <h2 className="mb-4 text-lg font-bold text-black">{joinedTeamName}에 참여했습니다.</h2>
          <Button className="w-full" onClick={handleConfirm}>
            확인
          </Button>
        </Modal>
      </section>
    </main>
  );
}
