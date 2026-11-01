import { useSiteCopy } from "@/components/brand/copy";
import { Stagger, StaggerItem } from "@/components/motion";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

/** Real guest comments, quoted from Google Maps. */
const reviews = [
  {
    name: "Bảo Yến",
    rating: 5,
    en: "A varied Thai menu with rich flavours and tender food. The upstairs air-conditioned area is comfortable; the restaurant is in an alley, but the food is worth finding.",
    vn: "Đồ Thái ở đây siêu nhiều, vị đậm đà mà giá mềm. Ngồi tầng 2 có điều hoà khá thoải mái. Quán nằm trong hẻm nên đi ô tô hơi bất tiện, đồ ăn chế biến hơi lâu nhưng xứng đáng chờ.",
  },
  {
    name: "RJC",
    rating: 5,
    en: "Really good food from Mix Food Am Thuc Thai! Everything was tasty and full of flavour. I really enjoyed the meal and would definitely recommend giving them a try. I’ll be ordering again from them!",
    vn: "Đồ ăn ở Mix Food Ẩm Thực Thái rất ngon! Món nào cũng đậm đà. Tôi rất thích bữa ăn này và sẽ giới thiệu mọi người đến thử. Tôi nhất định sẽ đặt lại!",
  },
  {
    name: "Hiếu",
    rating: 5,
    en: "The food is delicious and more affordable than many nearby places. The air-conditioned dining room is pleasant, and it is worth trying.",
    vn: "Đồ ăn ngon và rẻ hơn mấy quán Thái khác, có phòng điều hòa, đáng để thử.",
  },
];

const Reviews = () => {
  const ui = useUiText();
  const { lang, t } = useLanguage();
  const copy = useSiteCopy();

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-background py-16 md:py-24">
      <div className="page-container">
        <SectionHeading
          titleId="reviews-title"
          eyebrow={copy.reviewsEyebrow}
          title={t.reviews}
          align="center"
          className="mb-10 md:mb-14"
        />

        <Stagger as="ul" className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6" stagger={0.09}>
          {reviews.map((review) => (
            <StaggerItem as="li" key={review.name} className="h-full">
              <figure className="card-lift relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-layered">
                <span aria-hidden="true" className="absolute right-5 top-2 font-serif text-6xl leading-none text-brass/50">{"“"}</span>
                <div className="flex gap-0.5" role="img" aria-label={ui("{rating} out of 5 stars", { rating: review.rating })}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} aria-hidden="true" className="size-4 fill-spice text-spice" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-7 text-foreground/85">
                  {lang === "vn" ? review.vn : review.en}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-accent font-serif text-base font-semibold text-primary">
                    {review.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{review.name}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-8 text-center text-sm text-muted-foreground">{ui("Review source: Google Maps.")}</p>
      </div>
    </section>
  );
};

export default Reviews;
