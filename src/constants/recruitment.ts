export const RECRUITMENT_ROLES: Record<string, { slug: string; vn: string; description: string; seo: string }> = {
  SERVICE: { slug: 'nhan-vien-phuc-vu', vn: 'Nhân viên phục vụ', description: 'Đón tiếp và chăm sóc trải nghiệm của khách tại bàn.', seo: 'Tuyển nhân viên phục vụ nhà hàng tại Đà Nẵng.' },
  PARKING: { slug: 'nhan-vien-giu-xe', vn: 'Nhân viên giữ xe', description: 'Hướng dẫn, sắp xếp và bảo quản xe cho khách.', seo: 'Tuyển nhân viên giữ xe làm việc tại nhà hàng ở Đà Nẵng.' },
  KITCHEN_ASSISTANT: { slug: 'phu-bep', vn: 'Phụ bếp', description: 'Hỗ trợ sơ chế và giữ khu vực bếp luôn gọn gàng.', seo: 'Tuyển phụ bếp tại Đà Nẵng.' },
} as const;

export type Recruitment = {
  id: number;
  position: string;
  nameVi?: string | null;
  nameEn?: string | null;
  workingShifts?: { employmentType: 'PART_TIME' | 'FULL_TIME'; startTime: string; endTime: string }[];
  vacancies: number;
  isActive: boolean;
  createdAt: string;
  employmentTypes?: ('PART_TIME' | 'FULL_TIME')[];
  salaryAmount?: number | null;
  workingHours?: string | null;
  salaryUnit?: 'HOUR' | 'MONTH';
};

export const getRecruitmentSlug = (job: Recruitment): string => RECRUITMENT_ROLES[job.position]?.slug ?? `position-${job.id}`;

export const getRecruitmentName = (job: Recruitment, lang: 'en' | 'vn', ui: (text: string) => string): string =>
  (lang === 'en' ? job.nameEn : job.nameVi)?.trim() || ui(RECRUITMENT_ROLES[job.position]?.vn ?? job.nameVi ?? job.nameEn ?? job.position);
