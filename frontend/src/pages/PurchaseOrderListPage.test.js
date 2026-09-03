import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import PurchaseOrderListPage from "./PurchaseOrderListPage.vue";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    listPurchaseOrders: vi.fn(),
  },
}));

function mountPage() {
  return mount(PurchaseOrderListPage, {
    global: {
      stubs: {
        RouterLink: {
          props: ["to"],
          template: '<a :href="to"><slot /></a>',
        },
      },
    },
  });
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("PurchaseOrderListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders purchase orders returned by the API", async () => {
    api.listPurchaseOrders.mockResolvedValue({
      items: [
        {
          id: "po-1",
          poNumber: "PO-2026-0001",
          vendorName: "PT Maju",
          status: "SUBMITTED",
          createdAt: "2026-05-01T10:00:00.000Z",
        },
      ],
    });

    const wrapper = mountPage();
    await flushPromises();

    expect(api.listPurchaseOrders).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("PO-2026-0001");
    expect(wrapper.text()).toContain("PT Maju");
    expect(wrapper.find(".status-badge.submitted").text()).toBe("SUBMITTED");
  });

  test("renders an API error message", async () => {
    api.listPurchaseOrders.mockRejectedValue(
      new Error("Unable to load purchase orders"),
    );

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find(".error").text()).toBe(
      "Unable to load purchase orders",
    );
  });
});
