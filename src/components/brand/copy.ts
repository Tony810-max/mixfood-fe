import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Bilingual copy introduced by the redesign (header, home sections, menu and careers chrome).
 * Strings that already exist in `translations.ts` / `ui-copy.ts` are reused from there instead.
 * The `satisfies` clause makes TypeScript enforce that both languages define the same keys.
 */
const en = {
  careers: "Careers",
  language: "Language",
  mainNavigation: "Main navigation",
  drawerDescription: "Browse the site, switch language, sign in or reserve a table.",

  heroEyebrow: "A little Thailand, right in Da Nang",
  heroLineA: "Thai flavours.",
  heroLineB: "Warm moments.",
  heroTagline: "Sour. Spicy. Salty. Sweet. A little of everything.",
  findFavourite: "Find your favourite",

  kitchenEyebrow: "From the Mix Food kitchen",
  exploreDish: "Explore this dish",
  storyEyebrow: "Our story",
  reviewsEyebrow: "Guest voices",
  locationEyebrow: "Visit us",
  getDirections: "Get directions",

  menuEyebrow: "Menu",
  menuHint: "Tap a dish to see the photo and full description.",
  dishesCount: "dishes to discover",
  dishCategory: "Dish category",
  allDishes: "All dishes",
  searchDishes: "Search and filter",
  viewDetails: "View details",
  aboutDish: "About this dish",
  allergyNote: "Please let our team know about food allergies or your preferred spice level.",
  reserveForDish: "Reserve a table",
  descriptionPending: "The full description is being updated. Ask our team for more about this dish and its ingredients.",
  dishPages: "Dish pages",
  noResultsHint: "Try another name, or clear the filters to see the whole menu.",

  careersApply: "Apply for this role",
  notFoundHint: "Let us help you find your way back to the table.",
};

const vn = {
  careers: "Tuyển dụng",
  language: "Ngôn ngữ",
  mainNavigation: "Điều hướng chính",
  drawerDescription: "Xem trang, đổi ngôn ngữ, đăng nhập hoặc đặt bàn.",

  heroEyebrow: "Một chút Thái, ngay Đà Nẵng",
  heroLineA: "Trọn vị Thái.",
  heroLineB: "Ấm lòng người.",
  heroTagline: "Chua. Cay. Mặn. Ngọt. Đủ đầy trong một bữa ăn.",
  findFavourite: "Tìm món bạn yêu",

  kitchenEyebrow: "Từ căn bếp Mix Food",
  exploreDish: "Khám phá món này",
  storyEyebrow: "Câu chuyện của chúng tôi",
  reviewsEyebrow: "Lời khen từ thực khách",
  locationEyebrow: "Ghé thăm Mix Food",
  getDirections: "Chỉ đường",

  menuEyebrow: "Thực đơn",
  menuHint: "Chạm vào món ăn để xem ảnh và mô tả chi tiết.",
  dishesCount: "món ăn dành cho bạn",
  dishCategory: "Danh mục món ăn",
  allDishes: "Tất cả món",
  searchDishes: "Tìm kiếm và lọc món",
  viewDetails: "Xem chi tiết",
  aboutDish: "Về món ăn",
  allergyNote: "Vui lòng báo nhân viên nếu bạn dị ứng thực phẩm hoặc có yêu cầu riêng về độ cay.",
  reserveForDish: "Đặt bàn thưởng thức",
  descriptionPending: "Mô tả chi tiết đang được cập nhật. Bạn có thể liên hệ nhân viên để tìm hiểu thêm về món ăn và thành phần.",
  dishPages: "Phân trang món ăn",
  noResultsHint: "Hãy thử tên khác, hoặc xóa bộ lọc để xem toàn bộ thực đơn.",

  careersApply: "Ứng tuyển vị trí này",
  notFoundHint: "Để chúng tôi giúp bạn quay lại bàn ăn.",
} satisfies Record<keyof typeof en, string>;

export const siteCopy: Record<"en" | "vn", Record<keyof typeof en, string>> = { en, vn };

/** Redesign copy for the active language. */
export function useSiteCopy() {
  const { lang } = useLanguage();
  return siteCopy[lang];
}
