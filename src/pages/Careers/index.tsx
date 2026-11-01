import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { RESTAURANT, SITE } from '@/constants/site';
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, RotateCcw, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { RECRUITMENT_ROLES as labels, type Recruitment } from '@/constants/recruitment';
import { Link, useParams } from 'react-router-dom';
import { API_CONFIG } from '@/constants';
import { useLanguage, useUiText } from '@/contexts/LanguageContext';
import { ROUTES } from '@/utils/const';
import { formatVND } from '@/utils/formatters';
import { ApplicationForm } from './ApplicationForm';

export default function CareersPage() {
  const { lang, t } = useLanguage();
  const ui = useUiText();
  const [positions, setPositions] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [applicationPositionId, setApplicationPositionId] = useState<number>();
  const { slug } = useParams();
  const selectedRole = Object.values(labels).find((role) => role.slug === slug);
  const visiblePositions = useMemo(() => slug ? positions.filter((job) => labels[job.position].slug === slug) : positions, [positions, slug]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`${API_CONFIG.BASE_URL.replace(/\/$/, '')}/recruitment`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Recruitment unavailable'); return response.json(); })
      .then((data: Recruitment[]) => {
        if (!Array.isArray(data)) throw new Error('Invalid recruitment response');
        setPositions(data.filter((job) => job.isActive && job.position in labels));
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const id = 'career-job-posting-schema';
    const existing = document.head.querySelector<HTMLScriptElement>(`#${id}`);
    if (!slug || visiblePositions.length !== 1 || loading || error) {
      existing?.remove();
      return;
    }
    const script = existing ?? document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': visiblePositions.map((job) => ({
        '@type': 'JobPosting',
        title: ui(labels[job.position].vn),
        description: `${labels[job.position].seo} ${labels[job.position].description} Mix Food đang cần tuyển ${job.vacancies} vị trí.`,
        datePosted: new Date(job.createdAt).toISOString().slice(0, 10),
        employmentType: job.employmentTypes ?? ['PART_TIME', 'FULL_TIME'],
        ...(job.workingHours?.trim() ? { workHours: job.workingHours.trim() } : {}),
        ...(job.salaryAmount ? { baseSalary: { '@type': 'MonetaryAmount', currency: 'VND', value: { '@type': 'QuantitativeValue', value: job.salaryAmount, unitText: job.salaryUnit === 'MONTH' ? 'MONTH' : 'HOUR' } } } : {}),
        hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url, email: RESTAURANT.email },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: RESTAURANT.address, addressLocality: ui("Đà Nẵng"), addressCountry: 'VN' } },
        url: `${SITE.url}/careers/${labels[job.position].slug}`,
      })),
    });
    if (!existing) document.head.appendChild(script);
    return () => script.remove();
  }, [visiblePositions, slug, loading, error, lang, ui]);

  const jobGrid = slug || visiblePositions.length === 1 ? 'mx-auto max-w-3xl grid-cols-[minmax(0,1fr)]' : visiblePositions.length === 2 ? 'grid-cols-[minmax(0,1fr)] md:grid-cols-2' : 'grid-cols-[minmax(0,1fr)] md:grid-cols-2 lg:grid-cols-3';

  return <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16 md:pt-20">
      <section aria-labelledby="careers-title" className="relative overflow-hidden border-b border-border bg-secondary/50 py-14 md:py-20">
        <div className="page-container max-w-4xl text-center">
          <Stagger onMount stagger={0.08}>
            <StaggerItem>
              <p className="eyebrow inline-flex items-center justify-center gap-3">
                <span aria-hidden="true" className="brass-rule w-8" />
                <BriefcaseBusiness aria-hidden="true" className="size-4" />
                {ui("Mix Food tuyển dụng")}
                <span aria-hidden="true" className="brass-rule w-8" />
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 id="careers-title" className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">{selectedRole ? `Tuyển ${selectedRole.vn.toLowerCase()} tại Đà Nẵng` : ui("Tuyển dụng part-time & full-time tại Đà Nẵng.")}</h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{ui("Mix Food tìm đồng đội tận tâm cho các vị trí nhân viên phục vụ, phụ bếp và giữ xe. Ứng viên có thể trao đổi ca làm part-time hoặc full-time phù hợp khi phỏng vấn.")}</p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>
      <section className="page-container py-12 md:py-16">
        {slug && <Link to="/careers" className="mb-6 inline-flex min-h-11 items-center rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{ui("← Tất cả vị trí tuyển dụng")}</Link>}
        {loading ? <div role="status" aria-label={ui("Đang tải vị trí tuyển dụng…")} className={`grid gap-5 ${slug ? 'mx-auto max-w-3xl' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {Array.from({ length: slug ? 1 : 3 }, (_, index) => <div key={index} aria-hidden="true" className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3"><Skeleton className="size-11 rounded-xl" /><Skeleton className="h-5 w-2/3" /></div>
            <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" />
            <div className="space-y-3 border-t border-border pt-5"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-2/5" /><Skeleton className="h-4 w-3/5" /></div>
          </div>)}
        </div> : error ? <ErrorState
          headingLevel="h2"
          title={ui("Chưa tải được thông tin tuyển dụng. Vui lòng thử lại.")}
          action={<Button type="button" onClick={() => setAttempt((value) => value + 1)}><RotateCcw aria-hidden="true" />{ui("Thử lại")}</Button>}
        /> : visiblePositions.length === 0 ? <EmptyState
          icon={BriefcaseBusiness}
          headingLevel="h2"
          title={ui("Hiện chưa có vị trí tuyển dụng. Vui lòng quay lại sau.")}
          action={<Button asChild variant="outline"><Link to={ROUTES.HOME}>{t.home}</Link></Button>}
        /> : <Stagger className={`grid gap-5 ${jobGrid}`} stagger={0.08}>
          {visiblePositions.map((job) => {
            const position = labels[job.position];
            return <StaggerItem key={job.id} as="article" className={`card-lift grid content-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-layered ${slug ? '' : 'md:row-span-5 md:grid-rows-subgrid'}`}>
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brass/40 bg-brass/10 text-brass-strong"><UsersRound className="size-5" aria-hidden="true" /></span>
                <h2 className="min-w-0 break-words font-serif text-xl font-semibold leading-snug">{slug ? ui(position.vn) : <Link to={`/careers/${position.slug}`} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{ui(position.vn)}</Link>}</h2>
              </div>
              <div className="text-sm leading-6 text-muted-foreground">
                <p>{ui(position.description)}</p>
                {slug && <p className="mt-3">{ui("Nơi làm việc:")} {ui(RESTAURANT.address)}{ui(". Ngày đăng:")} <time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString(ui("vi-VN"))}</time>.</p>}
              </div>
              <div className="space-y-3 border-t border-border pt-5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2.5"><UsersRound className="size-4 shrink-0 text-brass-strong" aria-hidden="true" /><span className="min-w-0 break-words">{ui("Cần tuyển:")} <b className="font-semibold text-foreground">{job.vacancies} {ui("vị trí")}</b></span></p>
                <p className="flex items-center gap-2.5"><MapPin className="size-4 shrink-0 text-brass-strong" aria-hidden="true" /><span>{ui("Đà Nẵng")}</span></p>
                <p className="flex items-center gap-2.5"><Clock3 className="size-4 shrink-0 text-brass-strong" aria-hidden="true" /><span className="whitespace-pre-line break-words">{job.workingHours?.trim() || ui("Trao đổi khi phỏng vấn")}</span></p>
              </div>
              <div className="flex flex-wrap content-start gap-2">{(job.employmentTypes ?? ['PART_TIME', 'FULL_TIME']).map((type) => <Badge key={type} variant="brass" className="px-3 py-1">{ui(type === 'PART_TIME' ? 'Part-time' : 'Full-time')}</Badge>)}</div>
              <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{ui('Salary')}</p>
                  <p className="mt-1 font-serif text-lg font-semibold tabular-nums text-primary">{job.salaryAmount ? formatVND(job.salaryAmount) + ' / ' + ui(job.salaryUnit === 'MONTH' ? 'month' : 'hour') : ui('Negotiable')}</p>
                </div>
                <a href="#ung-tuyen" onClick={() => setApplicationPositionId(job.id)} className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{ui("Complete application form")}<ArrowRight aria-hidden="true" className="size-4" /></a>
              </div>
            </StaggerItem>;
          })}
        </Stagger>}
        {!loading && !error && visiblePositions.length > 0 && <Reveal><ApplicationForm positions={visiblePositions} selectedId={visiblePositions.some((job) => job.id === applicationPositionId) ? applicationPositionId! : visiblePositions[0].id} onSelect={setApplicationPositionId} /></Reveal>}
        <Reveal as="article" className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-secondary/50 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold">{ui("Cơ hội việc làm nhà hàng tại Đà Nẵng")}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{ui("Trang tuyển dụng Mix Food cập nhật các cơ hội việc làm bán thời gian và toàn thời gian tại Đà Nẵng. Nếu bạn đang tìm việc phục vụ part-time, phụ bếp, giữ xe hoặc muốn làm việc trong môi trường nhà hàng, hãy gửi hồ sơ để chúng tôi liên hệ khi có vị trí phù hợp.")}</p>
          <p className="mt-3 leading-7 text-muted-foreground">{ui("Kinh nghiệm là lợi thế; tinh thần trách nhiệm, thái độ tích cực và sự tôn trọng khách hàng là điều chúng tôi coi trọng. Số lượng tuyển cho từng vị trí được cập nhật trực tiếp trên trang này.")}</p>
        </Reveal>
      </section>
    </main>
    <Footer />
  </div>;
}
