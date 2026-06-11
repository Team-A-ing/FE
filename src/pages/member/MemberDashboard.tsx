import { useState } from 'react';
import CareerProfileCard from '@/components/career/CareerProfileCard';
import CareerTimelineSection from '@/components/career/CareerTimelineSection';
import ShowcaseSection from '@/components/career/ShowcaseSection';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useCareerDashboard } from '@/features/member/useCareerDashboard';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/api/user';

function renderSectionFallback(message: string) {
  return (
    <Card className="rounded-lg p-5">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </Card>
  );
}

function renderDashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-5 p-5 sm:p-6">
      <div className="rounded-lg bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-2 h-4 w-72 max-w-full" />
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item}>
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="mt-1.5 h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="mt-6 h-px w-full" />
        <Skeleton className="mt-4 h-4 w-4/5" />
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 sm:p-5">
        <Skeleton className="mb-3 h-3 w-32" />
        <div className="grid gap-3 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[124px] rounded-lg" />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-5 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-3 w-72 max-w-full" />
        <div className="mt-5 space-y-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="mx-auto h-14 max-w-[860px] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MemberDashboard() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const memberId = user?.id;
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, errors } = useCareerDashboard(memberId, refreshKey);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function openEdit() {
    setEditName(user?.name ?? '');
    setEditJobTitle(user?.jobTitle ?? '');
    setEditError(null);
    setEditOpen(true);
  }

  async function handleSave() {
    if (!editName.trim()) { setEditError('이름을 입력해주세요.'); return; }
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateProfile(editName.trim(), editJobTitle.trim() || null);
      setAuth(updated, token ?? '');
      setRefreshKey((k) => k + 1);
      setEditOpen(false);
    } catch {
      setEditError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageLayout>
      <div className="min-h-full">
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-base font-semibold text-gray-900">프로필 수정</h2>
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">이름</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">직함</label>
                  <input
                    value={editJobTitle}
                    onChange={(e) => setEditJobTitle(e.target.value)}
                    placeholder="예) 프론트엔드 개발자"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {editError && <p className="text-xs text-red-500">{editError}</p>}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          renderDashboardSkeleton()
        ) : (
          <div className="mx-auto flex max-w-[1120px] flex-col gap-5 p-5 sm:p-6">
            {data.stats ? (
              <CareerProfileCard stats={data.stats} onEdit={openEdit} />
            ) : (
              renderSectionFallback(
                errors.stats ?? '프로필 정보를 불러오지 못했습니다. 다시 시도해주세요.',
              )
            )}

            {errors.showcase ? (
              renderSectionFallback(errors.showcase)
            ) : (
              <ShowcaseSection events={data.showcase} />
            )}

            {errors.timeline ? (
              renderSectionFallback(errors.timeline)
            ) : (
              <CareerTimelineSection events={data.timeline} />
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
