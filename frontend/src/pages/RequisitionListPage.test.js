import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import RequisitionListPage from "./RequisitionListPage.vue";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    listRequisitions: vi.fn(),
  },
}));

function mountPage() {
  return mount(RequisitionListPage, {
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

describe("RequisitionListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders requisitions returned by the API", async () => {
    api.listRequisitions.mockResolvedValue({
      items: [
        {
          id: "pr-1",
          prNumber: "PR-2026-0001",
          requesterName: "Rina",
          departmentName: "Operations",
          title: "Warehouse supplies",
          status: "DRAFT",
          neededByDate: "2026-06-15",
        },
      ],
    });

    const wrapper = mountPage();
    await flushPromises();

    expect(api.listRequisitions).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("PR-2026-0001");
    expect(wrapper.text()).toContain("Rina");
    expect(wrapper.text()).toContain("Operations");
    expect(wrapper.text()).toContain("Warehouse supplies");
    expect(wrapper.find(".status-badge.draft").text()).toBe("DRAFT");
  });

  test("renders an API error message", async () => {
    api.listRequisitions.mockRejectedValue(
      new Error("Unable to load requisitions"),
    );

    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find(".error").text()).toBe("Unable to load requisitions");
  });
});
