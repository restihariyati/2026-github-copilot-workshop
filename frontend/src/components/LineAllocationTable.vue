<template>
  <div class="card-panel allocation-panel">
    <div class="card-panel-header">
      <p class="form-section-title">Line Allocation</p>
      <button type="button" class="btn btn-outline" @click="addLine">
        + New Line
      </button>
    </div>

    <div class="table-scroll">
      <table class="allocation-table">
        <thead>
          <tr>
            <th style="width: 56px">Line</th>
            <th>PR Line ID</th>
            <th>PR Number</th>
            <th>PR Line</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th style="width: 96px">Available</th>
            <th style="width: 96px">Order Qty</th>
            <th style="width: 80px">UOM</th>
            <th>Unit Price</th>
            <th>Site</th>
            <th>Required Date</th>
            <th style="width: 64px">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(line, index) in modelValue" :key="line.localId">
            <td>{{ index + 1 }}</td>
            <td>
              <input
                :value="line.prLineId"
                placeholder="PR line UUID"
                required
                @input="updateLine(index, 'prLineId', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.prNumber"
                placeholder="Type..."
                @input="updateLine(index, 'prNumber', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.prLineNo"
                placeholder="Type..."
                @input="updateLine(index, 'prLineNo', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.itemCode"
                placeholder="Type..."
                required
                @input="updateLine(index, 'itemCode', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.itemName"
                placeholder="Type..."
                required
                @input="updateLine(index, 'itemName', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.availableQty"
                type="number"
                min="0"
                step="0.01"
                @input="updateLine(index, 'availableQty', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.qtyOrdered"
                type="number"
                min="0.01"
                step="0.01"
                required
                @input="updateLine(index, 'qtyOrdered', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.uom"
                placeholder="Type..."
                required
                @input="updateLine(index, 'uom', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.unitPrice"
                type="number"
                min="0"
                step="0.01"
                required
                @input="updateLine(index, 'unitPrice', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.siteCode"
                placeholder="Type..."
                required
                @input="updateLine(index, 'siteCode', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="line.requiredDate"
                type="date"
                @input="updateLine(index, 'requiredDate', $event.target.value)"
              />
            </td>
            <td class="action-cell">
              <button
                type="button"
                class="btn-danger-icon"
                title="Remove"
                @click="removeLine(index)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 1.5h5M2 3.5h12M3.5 3.5l.75 9.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5l.75-9.5M6.5 6.5v4.5M9.5 6.5v4.5"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

let localLineCounter = 1;

function createEmptyLine() {
  localLineCounter += 1;

  return {
    localId: `line-${Date.now()}-${localLineCounter}`,
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
  };
}

function addLine() {
  emit("update:modelValue", [...props.modelValue, createEmptyLine()]);
}

function removeLine(index) {
  if (props.modelValue.length === 1) return;

  emit(
    "update:modelValue",
    props.modelValue.filter((_, lineIndex) => lineIndex !== index),
  );
}

function updateLine(index, field, value) {
  const nextLines = props.modelValue.map((line, lineIndex) => {
    if (lineIndex !== index) return line;

    return { ...line, [field]: value };
  });

  emit("update:modelValue", nextLines);
}
</script>

<style scoped>
.allocation-panel .form-section-title {
  margin: 0;
}

.table-scroll {
  overflow-x: auto;
}

.allocation-table {
  min-width: 1360px;
}

.allocation-table input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius-input);
  font-family: inherit;
  font-size: 13px;
}

.allocation-table input:focus {
  border-color: var(--primary);
  outline: none;
}

.action-cell {
  text-align: center;
}
</style>
