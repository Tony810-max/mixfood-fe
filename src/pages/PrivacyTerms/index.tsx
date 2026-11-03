import { useUiText } from '@/contexts/LanguageContext';
import { INFORMATION_RESTAURANT } from '@/utils/const';
import InformationLayout from '../Information/InformationLayout';

const privacySections = [
  ['Information you provide', 'Depending on the features you use, you may provide your name, phone number, email, reservation details, order notes, support messages or recruitment application information. Only submit information needed for your request; do not send passwords or verification codes in chat.'],
  ['How information is used', 'Information submitted through the website supports account access, table reservations, orders at your table, customer support and recruitment applications. Contact the restaurant if you have questions about information you have submitted.'],
  ['Cookies and website services', 'The website uses a cookie to remember your language preference. Account and table-ordering features also use browser storage to maintain your session. External services, including Google Analytics when enabled, may receive usage information. You can manage cookies and storage in your browser; clearing them may sign you out or interrupt your table session.'],
  ['Your information and requests', 'For questions about access, correction or deletion of information you have submitted, contact Mix Food using the details below. Please identify the relevant request without including passwords or verification codes.'],
] as const;

const termsSections = [
  ['Using the website', 'Provide accurate information when creating an account, booking a table or applying for a role. Keep your verification codes and account access private. Do not misuse the website, interfere with its operation or submit harmful content.'],
  ['Reservations and table orders', 'Review your date, time, guest count and contact details before sending a reservation request. Check its status and contact the restaurant for changes. QR ordering is for guests at the restaurant: check the table, dishes, quantities and notes before submitting. Contact staff for order changes, allergies or payment assistance.'],
  ['Menu and availability', 'Check the current menu for dish details and prices. Availability may change during service. If you have an allergy or dietary requirement, speak with staff before ordering.'],
  ['Questions and updates', 'Contact Mix Food if you need help with the website, a reservation or an order. Review this page for the current information about privacy and website use.'],
] as const;

export default function PrivacyTermsPage() {
  const ui = useUiText();
  return (
    <InformationLayout title={ui('Privacy & Terms')} intro={ui('Information about your privacy and using the Mix Food website, together in one place.')}>
      <nav aria-label={ui('On this page')} className="flex flex-wrap gap-3">
        <a className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="#privacy">{ui('Privacy')}</a>
        <a className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="#terms">{ui('Terms of use')}</a>
      </nav>
      {([{ id: 'privacy', title: 'Privacy', sections: privacySections }, { id: 'terms', title: 'Terms of use', sections: termsSections }] as const).map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28">
          <h2 id={`${group.id}-heading`} className="font-serif text-3xl font-semibold text-primary">{ui(group.title)}</h2>
          <div className="mt-6 space-y-7">
            {group.sections.map(([title, body]) => (
              <section key={title}>
                <h3 className="text-lg font-semibold">{ui(title)}</h3>
                <p className="mt-2 leading-8 text-muted-foreground">{ui(body)}{(title === 'How information is used' || title === 'Cookies and website services' || title === 'Reservations and table orders') && <span className="font-medium text-primary"> {ui('QR table ordering: coming soon.')}</span>}</p>
              </section>
            ))}
          </div>
        </section>
      ))}
      <section aria-labelledby="policy-contact" className="border-t border-border pt-8">
        <h2 id="policy-contact" className="font-serif text-2xl font-semibold">{ui('Contact Mix Food')}</h2>
        <address className="mt-4 space-y-3 not-italic leading-7">
          <p>{INFORMATION_RESTAURANT.address}</p>
          <p><a className="inline-flex min-h-11 max-w-full items-center break-all rounded-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`mailto:${INFORMATION_RESTAURANT.email}`}>{INFORMATION_RESTAURANT.email}</a></p>
          <p><a className="inline-flex min-h-11 items-center rounded-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, '')}`}>{INFORMATION_RESTAURANT.phone}</a></p>
        </address>
      </section>
    </InformationLayout>
  );
}
