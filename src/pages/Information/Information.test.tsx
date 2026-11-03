import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AboutPage from '../About';
import PrivacyTermsPage from '../PrivacyTerms';

vi.mock('@/components/layout/Header', () => ({ default: () => null }));
vi.mock('@/components/layout/Footer', () => ({ default: () => null }));
afterEach(cleanup);

describe('Restaurant information pages', () => {
  it.each(['en', 'vn'])('offers menu and booking from About in %s', (lang) => {
    document.cookie = `lang=${lang};path=/`;
    render(<LanguageProvider><MemoryRouter><AboutPage /></MemoryRouter></LanguageProvider>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('link', { name: lang === 'en' ? 'View Menu' : 'Xem Thực Đơn' })).toHaveAttribute('href', '/menu');
    expect(document.querySelector('a[href="/booking"]')).not.toBeNull();
    expect(screen.getByRole('heading', { name: lang === 'en' ? 'Thai food in Da Nang' : 'Ẩm thực Thái tại Đà Nẵng' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: lang === 'en' ? 'Frequently asked questions' : 'Câu hỏi thường gặp' })).toBeInTheDocument();
  });

  it.each(['en', 'vn'])('combines privacy and terms with contact information in %s', (lang) => {
    document.cookie = `lang=${lang};path=/`;
    render(<LanguageProvider><MemoryRouter><PrivacyTermsPage /></MemoryRouter></LanguageProvider>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: lang === 'en' ? 'Privacy' : 'Quyền riêng tư' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: lang === 'en' ? 'Terms of use' : 'Điều khoản sử dụng' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mixfood1708@gmail.com' })).toHaveAttribute('href', 'mailto:mixfood1708@gmail.com');
  });
});
