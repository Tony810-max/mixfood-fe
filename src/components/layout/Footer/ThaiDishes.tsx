import { THAI_DISHES } from "@/utils/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { FooterLink } from './FooterLink';

const ThaiDishes = () => {
  const { t } = useLanguage();

  return (
    <nav aria-labelledby="footer-dishes" className="space-y-3">
      <h2 id="footer-dishes" className="eyebrow-on-dark">{t.footerSpecialtyDishes}</h2>
      <ul>
        {THAI_DISHES.map((dish) => (
          <li key={dish.href}>
            <FooterLink to={dish.href}>{dish.name}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ThaiDishes;
