import CareerProfileCard from '@/components/career/CareerProfileCard';
import CareerTimelineSection from '@/components/career/CareerTimelineSection';
import ShowcaseSection from '@/components/career/ShowcaseSection';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useCareerDashboard } from '@/features/member/useCareerDashboard';
import { useAuthStore } from '@/stores/authStore';

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
  const memberId = user?.id;
  const { data, loading, errors } = useCareerDashboard(memberId);

  return (
    <PageLayout>
      <div className="min-h-full">
        {loading ? (
          renderDashboardSkeleton()
        ) : (
          <div className="mx-auto flex max-w-[1120px] flex-col gap-5 p-5 sm:p-6">
            {data.stats ? (
              <CareerProfileCard stats={data.stats} />
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
