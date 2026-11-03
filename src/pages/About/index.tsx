import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage, useUiText } from '@/contexts/LanguageContext';
import { INFORMATION_RESTAURANT, ROUTES } from '@/utils/const';
import InformationLayout from '../Information/InformationLayout';

const storySections = [
  {
    id: 'thai-food',
    title: 'Thai food in Da Nang',
    paragraphs: [
      'Looking for Thai food in Da Nang? Mix Food is a Thai restaurant where you can explore dishes for a relaxed lunch, an evening meal or a gathering with friends. This website brings the menu, table reservations and restaurant contact details together so you can plan your visit before setting out.',
      'Thai cuisine brings together sour, spicy, salty and sweet flavours. At Mix Food, the menu is a starting point for discovering that variety: choose a dish you already enjoy or explore something different with the people at your table. Speak with our team about your preferences before ordering.',
    ],
  },
  {
    id: 'explore-menu',
    title: 'Explore Tom Yum, Pad Thai, Som Tam and more',
    paragraphs: [
      'Tom Yum, Pad Thai, Som Tam and mango sticky rice are among the dishes introduced on the Mix Food website. Start with the online menu to compare dishes, read the available descriptions and check current prices. Use the search to find a dish by name and put together a meal that suits your group.',
      'A shared meal gives everyone a chance to try different flavours. Discuss portions, spice preferences and the dishes you would like to share with staff. If you have allergies or dietary requirements, tell the team before ordering so they can help you review the available options.',
    ],
  },
  {
    id: 'reserve-table',
    title: 'Plan a meal with friends and family',
    paragraphs: [
      'Whether you are meeting friends or gathering with family, planning ahead makes the visit easier. You can send a table reservation request through the website by choosing a date, time and number of guests. Review your contact details and include any relevant notes before submitting.',
      'After sending your request, check its status and contact Mix Food if your plans change or you need help. For questions about a larger group or a specific requirement, call the restaurant to discuss the details before your visit.',
    ],
  },
  {
    id: 'table-ordering',
    title: 'Order at your table with a QR code',
    paragraphs: [
      'When dining at Mix Food, scan the QR code at your table to open the table menu. You can browse dishes, add items to your cart and review quantities and notes before sending an order. Check that the displayed table is yours before submitting.',
      'The table-ordering area also lets you follow your orders, message the team and view the bill. Staff remain available if you need help choosing dishes, changing an order or arranging payment. These features support your meal at the restaurant.',
    ],
  },
] as const;

const questions = [
  ['Where is Mix Food in Da Nang?', 'You can find the restaurant address, opening hours and phone number in the visit information below. Contact the team if you need help finding us.'],
  ['Can I see the menu before visiting?', 'Yes. Open the menu on this website to browse dishes, search by name and check the displayed prices before planning your meal.'],
  ['How can I reserve a table at Mix Food?', 'Use the table reservation page to send your preferred date, time, guest count and contact details. Check the status of your request and contact the restaurant if you need assistance.'],
  ['How do I ask about allergies or spice levels?', 'Speak with the restaurant team before ordering and explain your allergy, dietary requirement or preferred spice level. Ask staff to confirm suitable options for your meal.'],
] as const;

export default function AboutPage() {
  const ui = useUiText();
  const { t } = useLanguage();

  return (
    <InformationLayout title={ui('About Mix Food')} intro={ui('Thai flavours, shared in Da Nang. Mix Food welcomes you to explore our menu and enjoy a meal together.')}>
      <section aria-labelledby="about-table">
        <h2 id="about-table" className="font-serif text-2xl font-semibold md:text-3xl">{ui('A place to gather')}</h2>
        <p className="mt-4 leading-8 text-muted-foreground">{ui('From Tom Yum and Pad Thai to Som Tam and mango sticky rice, discover Thai dishes at Mix Food. Browse the menu to find something for your next meal with friends and family.')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to={ROUTES.MENU}>{t.viewMenu}</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to={ROUTES.BOOKING}>{t.reserveTable}</Link></Button>
        </div>
      </section>
      {storySections.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id} className="font-serif text-2xl font-semibold md:text-3xl">{ui(section.title)}{section.id === 'table-ordering' && <span className="ml-2 inline-block rounded-md bg-secondary px-2 py-1 align-middle font-body text-sm font-medium text-primary">{ui('Coming soon')}</span>}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-muted-foreground">{ui(paragraph)}</p>)}
          {section.id === 'explore-menu' && <Link className="mt-4 inline-flex min-h-11 items-center rounded-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to={ROUTES.MENU}>{ui('Explore the Thai food menu')}</Link>}
          {section.id === 'reserve-table' && <Link className="mt-4 inline-flex min-h-11 items-center rounded-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to={ROUTES.BOOKING}>{ui('Send a table reservation request')}</Link>}
        </section>
      ))}
      <section aria-labelledby="about-questions">
        <h2 id="about-questions" className="font-serif text-2xl font-semibold md:text-3xl">{ui('Frequently asked questions')}</h2>
        <div className="mt-6 space-y-6">
          {questions.map(([question, answer]) => (
            <section key={question}>
              <h3 className="text-lg font-semibold">{ui(question)}</h3>
              <p className="mt-2 leading-8 text-muted-foreground">{ui(answer)}</p>
            </section>
          ))}
        </div>
      </section>
      <section aria-labelledby="about-visit">
        <h2 id="about-visit" className="font-serif text-2xl font-semibold md:text-3xl">{ui('Plan your visit')}</h2>
        <p className="mt-4 leading-8 text-muted-foreground">{ui('Browse dishes online, send a table reservation request, or scan the QR code at your table to order and contact the team during your visit.')} <span className="font-medium text-primary">{ui('QR table ordering: coming soon.')}</span></p>
        <dl className="mt-6 grid gap-5 border-y border-border py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-8">
          <dt className="font-medium">{ui('Address')}</dt><dd>{INFORMATION_RESTAURANT.address}</dd>
          <dt className="font-medium">{ui('Working hours')}</dt><dd>{t.hoursValue}</dd>
          <dt className="font-medium">{ui('Phone')}</dt><dd><a className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, '')}`}>{INFORMATION_RESTAURANT.phone}</a></dd>
        </dl>
      </section>
    </InformationLayout>
  );
}
