import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Dish {
  nameKey: keyof ReturnType<typeof useLanguage>["t"];
  price: string;
  image: string;
}

const dishes: Dish[] = [
  {
    nameKey: "padThai",
    price: "145,000đ",
    image: "/images/pad-thai.webp",
  },
  {
    nameKey: "greenCurry",
    price: "165,000đ",
    image: "/image-blank.webp",
  },
  {
    nameKey: "tomYum",
    price: "175,000đ",
    image: "/images/tomyum-hs.webp",
  },
  {
    nameKey: "somTum",
    price: "95,000đ",
    image: "/images/som-tam.webp",
  },
  {
    nameKey: "mangoRice",
    price: "85,000đ",
    image: "/images/xoi-xoai.webp",
  },
  {
    nameKey: "hotPot",
    price: "",
    image: "/images/ho-tien-hs.webp",
  },
];

const BestSellers = () => {
  const { t } = useLanguage();

  return (
    <section id="menu" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-16 space-y-3"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            {t.bestSellers}
          </h2>
          <p className="text-muted-foreground text-lg">{t.bestSellersSub}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-4 shadow-layered hover:shadow-layered-hover transition-shadow cursor-pointer"
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src={dish.image}
                  alt={t[dish.nameKey] as string}
                  className="aspect-square w-full"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif text-xl font-semibold mt-4 text-foreground text-balance">
                {t[dish.nameKey] as string}
              </h3>
              <span className="text-primary font-semibold tabular-nums mt-4 block text-lg">
                {dish.price}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
