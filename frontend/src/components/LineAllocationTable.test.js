import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import LineAllocationTable from "./LineAllocationTable.vue";

function allocationLine(overrides = {}) {
  return {
    localId: "line-1",
    prLineId: "pr-line-1",
    prNumber: "PR-2026-0001",
    prLineNo: 1,
    itemCode: "BRG-001",
    itemName: "Safety Helmet",
    availableQty: 10,
    qtyOrdered: 2,
    uom: "PCS",
    unitPrice: 150000,
    siteCode: "WH-JKT",
    requiredDate: "2026-06-10",
    ...overrides,
  };
}

describe("LineAllocationTable", () => {
  test("renders required validation inputs for allocation lines", () => {
    const wrapper = mount(LineAllocationTable, {
      props: { modelValue: [allocationLine()] },
    });
    const inputs = wrapper.findAll("input");

    expect(
      wrapper.find('input[placeholder="PR line UUID"]').attributes("required"),
    ).toBeDefined();
    expect(inputs[3].attributes("required")).toBeDefined();
    expect(inputs[4].attributes("required")).toBeDefined();
    expect(inputs[6].attributes("min")).toBe("0.01");
    expect(inputs[8].attributes("min")).toBe("0");
  });

  test("emits updated lines when a field changes", async () => {
    const wrapper = mount(LineAllocationTable, {
      props: { modelValue: [allocationLine()] },
    });

    await wrapper
      .find('input[placeholder="PR line UUID"]')
      .setValue("pr-line-2");

    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual([
      allocationLine({ prLineId: "pr-line-2" }),
    ]);
  });

  test("does not remove the final line", async () => {
    const wrapper = mount(LineAllocationTable, {
      props: { modelValue: [allocationLine()] },
    });

    await wrapper.find('button[title="Remove"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
