import { afterEach, describe, expect, it } from "vitest";
import { formatVND, generateIdempotencyKey, ORDER_STATUS_LABEL } from "./helpers";

describe("table-order helpers", () => {
  afterEach(() => { document.cookie = "lang=;max-age=0;path=/"; });
  it("formats totals using Vietnamese currency", () => {
    document.cookie = "lang=vn;path=/";
    expect(formatVND(125_000)).toBe("125.000đ");
  });

  it("formats totals using English currency", () => {
    document.cookie = "lang=en;path=/";
    expect(formatVND(125_000)).toBe("125,000đ");
  });

  it("creates a new idempotency key for every checkout", () => {
    const first = generateIdempotencyKey();
    const second = generateIdempotencyKey();

    expect(first).not.toBe(second);
    expect(first).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it("keeps order status labels human-readable", () => {
    expect(ORDER_STATUS_LABEL.PREPARING).toBe("Đang chuẩn bị");
    expect(ORDER_STATUS_LABEL.READY).toBe("Sẵn sàng");
  });
});
