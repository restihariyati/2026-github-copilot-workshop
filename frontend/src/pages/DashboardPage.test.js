import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import DashboardPage from "./DashboardPage.vue";
import { api } from "../api";

vi.mock("../api", () => ({
  api: {
    getDashboard: vi.fn(),
  },
}));

function mountPage() {
  return mount(DashboardPage, {
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

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dashboard stats and recent purchase requisitions", async () => {
    api.getDashboard.mockResolvedValue({
      totalPr: 3,
      draftPr: 1,
      submittedPr: 1,
      approvedPr: 1,
      recentPr: [
        {
          id: "pr-1",
          prNumber: "PR-2026-0001",
          requesterName: "Rina",
          status: "APPROVED",
          createdAt: "2026-05-01T10:00:00.000Z",
        },
      ],
    });

    const wrapper = mountPage();
    await flushPromises();

    expect(api.getDashboard).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("Open PR");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("Draft");
    expect(wrapper.text()).toContain("Submitted");
    expect(wrapper.text()).toContain("Approved");
    expect(wrapper.text()).toContain("PR-2026-0001");
    expect(wrapper.text()).toContain("Rina");
    expect(wrapper.find(".status-badge.approved").text()).toBe("APPROVED");
  });
});
