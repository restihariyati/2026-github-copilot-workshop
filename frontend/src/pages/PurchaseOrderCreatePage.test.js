import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import PurchaseOrderCreatePage from "./PurchaseOrderCreatePage.vue";
import { api } from "../api";

const { push } = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("vue-router", () => ({
  RouterLink: {
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
  useRouter: () => ({ push }),
}));

vi.mock("../api", () => ({
  api: {
    createPurchaseOrder: vi.fn(),
  },
}));

function mountPage() {
  return mount(PurchaseOrderCreatePage);
}

async function fillPurchaseOrderForm(wrapper, { availableQty, qtyOrdered }) {
  const inputs = wrapper.findAll("input");
  const lineOffset = 6;

  await inputs[0].setValue("PT Maju");
  await inputs[lineOffset].setValue("pr-line-1");
  await inputs[lineOffset + 3].setValue("BRG-001");
  await inputs[lineOffset + 4].setValue("Safety Helmet");
  await inputs[lineOffset + 5].setValue(availableQty);
  await inputs[lineOffset + 6].setValue(qtyOrdered);
  await inputs[lineOffset + 7].setValue("PCS");
  await inputs[lineOffset + 8].setValue(150000);
  await inputs[lineOffset + 9].setValue("WH-JKT");
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("PurchaseOrderCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows a validation error when ordered quantity exceeds available quantity", async () => {
    const wrapper = mountPage();
    await fillPurchaseOrderForm(wrapper, { availableQty: 3, qtyOrdered: 5 });

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.find(".error").text()).toBe(
      "lines[0]: allocation qty 5 exceeds remaining 3",
    );
    expect(api.createPurchaseOrder).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  test("submits a valid payload and navigates to the created purchase order", async () => {
    api.createPurchaseOrder.mockResolvedValue({ id: "po-1" });
    const wrapper = mountPage();
    await fillPurchaseOrderForm(wrapper, { availableQty: 10, qtyOrdered: 5 });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(api.createPurchaseOrder).toHaveBeenCalledWith({
      vendorName: "PT Maju",
      lines: [
        {
          prLineId: "pr-line-1",
          itemCode: "BRG-001",
          itemName: "Safety Helmet",
          qtyOrdered: 5,
          uom: "PCS",
          unitPrice: 150000,
          siteCode: "WH-JKT",
          requiredDate: "",
        },
      ],
    });
    expect(push).toHaveBeenCalledWith("/purchase-orders/po-1");
  });
});
