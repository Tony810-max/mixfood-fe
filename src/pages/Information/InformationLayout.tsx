import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function InformationLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header />
      <main className="min-w-0 flex-1 pt-16 md:pt-20">
        <div className="page-container py-14 md:py-24">
          <div className="mx-auto max-w-3xl break-words">
            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight text-primary md:text-6xl">{title}</h1>
            <p className="mt-6 max-w-prose text-lg leading-8 text-muted-foreground">{intro}</p>
            <div className="mt-10 space-y-10 border-t border-border pt-10 md:mt-14 md:pt-14">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
