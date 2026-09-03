<template>
  <section>
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/" class="back-btn" title="Back to Dashboard"
          >&#8592;</RouterLink
        >
        <div>
          <h2>Create Purchase Order</h2>
          <p class="muted">
            Create PO with vendor information and PR line allocation
          </p>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <form @submit.prevent="handleSubmit">
      <PurchaseOrderHeaderForm v-model="header" />
      <LineAllocationTable v-model="lines" />

      <div class="po-summary">
        <span>Total Lines: {{ lines.length }}</span>
        <span>Estimated Total: {{ formattedTotal }}</span>
      </div>

      <div class="btn-group">
        <RouterLink to="/" class="btn btn-outline">Cancel</RouterLink>
        <button class="btn btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? "Saving..." : "Save As Draft" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { api } from "../api";
import LineAllocationTable from "../components/LineAllocationTable.vue";
import PurchaseOrderHeaderForm from "../components/PurchaseOrderHeaderForm.vue";

const router = useRouter();
const errorMessage = ref("");
const submitting = ref(false);

const header = ref({
  vendorName: "",
  vendorContact: "",
  paymentTerms: "Net 30",
  orderDate: new Date().toISOString().slice(0, 10),
  currency: "IDR",
  buyerName: "",
  departmentName: "",
  deliverySite: "",
  notes: "",
});

const lines = ref([
  {
    localId: "line-1",
    prLineId: "",
    prNumber: "",
    prLineNo: "",
    itemCode: "",
    itemName: "",
    availableQty: "",
    qtyOrdered: 1,
    uom: "PCS",
    unitPrice: 0,
    siteCode: "",
    requiredDate: "",
  },
]);

const formattedTotal = computed(() => {
  const total = lines.value.reduce((sum, line) => {
    return sum + Number(line.qtyOrdered || 0) * Number(line.unitPrice || 0);
  }, 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: header.value.currency || "IDR",
    maximumFractionDigits: 0,
  }).format(total);
});

// Pre-flight check against PR remaining qty so the user gets fast feedback
// before hitting the backend's authoritative over-allocation guard.
function findOverAllocationError() {
  for (let i = 0; i < lines.value.length; i++) {
    const line = lines.value[i];
    const remaining = Number(line.availableQty);
    const ordered = Number(line.qtyOrdered);

    if (
      line.availableQty !== "" &&
      !Number.isNaN(remaining) &&
      ordered > remaining
    ) {
      return `lines[${i}]: allocation qty ${ordered} exceeds remaining ${remaining}`;
    }
  }
  return null;
}

async function handleSubmit() {
  errorMessage.value = "";

  const overAllocationError = findOverAllocationError();
  if (overAllocationError) {
    errorMessage.value = overAllocationError;
    return;
  }

  const payload = {
    vendorName: header.value.vendorName,
    lines: lines.value.map(
      ({ localId, prNumber, prLineNo, availableQty, ...line }) => ({
        ...line,
        qtyOrdered: Number(line.qtyOrdered),
        unitPrice: Number(line.unitPrice),
      }),
    ),
  };

  submitting.value = true;
  try {
    const created = await api.createPurchaseOrder(payload);
    await router.push(`/purchase-orders/${created.id}`);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.po-summary {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  margin: -8px 0 24px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 720px) {
  .po-summary {
    align-items: flex-end;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
