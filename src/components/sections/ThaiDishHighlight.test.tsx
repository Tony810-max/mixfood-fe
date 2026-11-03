import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ThaiDishHighlight from './ThaiDishHighlight';
import { DishMarquee } from './DishMarquee';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Dish discovery', () => {
  it('keeps the clicked dish selected when the pointer passes other dishes', () => {
    vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
    document.cookie = 'lang=en;path=/';
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({ matches: query === '(hover: hover)', media: query, addListener: vi.fn(), removeListener: vi.fn() } as unknown as MediaQueryList));
    render(<LanguageProvider><MemoryRouter><ThaiDishHighlight /></MemoryRouter></LanguageProvider>);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    fireEvent.mouseEnter(buttons[2]);
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /Explore this dish/i })).toHaveAttribute('href', '/menu?q=Pad%20Thai');
  });

  it('localizes dish names in the marquee in Vietnamese', () => {
    document.cookie = 'lang=vn;path=/';
    render(<LanguageProvider><MemoryRouter><DishMarquee /></MemoryRouter></LanguageProvider>);
    expect(screen.getAllByRole('link', { name: /Xôi xoài/i }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: 'Mango Sticky Rice' })).not.toBeInTheDocument();
  });
});
