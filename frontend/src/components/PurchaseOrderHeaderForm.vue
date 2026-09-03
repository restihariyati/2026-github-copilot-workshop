<template>
  <div class="card-panel po-header-form">
    <p class="form-section-title">PO Header</p>

    <div class="form-row">
      <div class="form-group">
        <label for="vendorName">Vendor Name</label>
        <input
          id="vendorName"
          :value="modelValue.vendorName"
          placeholder="Type..."
          required
          @input="updateField('vendorName', $event.target.value)"
        />
      </div>

      <div class="form-group">
        <label for="vendorContact">Vendor Contact</label>
        <input
          id="vendorContact"
          :value="modelValue.vendorContact"
          placeholder="Type..."
          @input="updateField('vendorContact', $event.target.value)"
        />
      </div>

      <div class="form-group">
        <label for="paymentTerms">Payment Terms</label>
        <select
          id="paymentTerms"
          :value="modelValue.paymentTerms"
          @input="updateField('paymentTerms', $event.target.value)"
        >
          <option value="Net 30">Net 30</option>
          <option value="Net 45">Net 45</option>
          <option value="COD">COD</option>
        </select>
      </div>

      <div class="form-group">
        <label for="orderDate">Order Date</label>
        <input
          id="orderDate"
          :value="modelValue.orderDate"
          type="date"
          @input="updateField('orderDate', $event.target.value)"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="currency">Currency</label>
        <select
          id="currency"
          :value="modelValue.currency"
          @input="updateField('currency', $event.target.value)"
        >
          <option value="IDR">IDR</option>
          <option value="USD">USD</option>
          <option value="SGD">SGD</option>
        </select>
      </div>

      <div class="form-group">
        <label for="buyerName">Buyer Name</label>
        <input
          id="buyerName"
          :value="modelValue.buyerName"
          placeholder="Type..."
          @input="updateField('buyerName', $event.target.value)"
        />
      </div>

      <div class="form-group">
        <label for="departmentName">Department</label>
        <input
          id="departmentName"
          :value="modelValue.departmentName"
          placeholder="Type..."
          @input="updateField('departmentName', $event.target.value)"
        />
      </div>

      <div class="form-group">
        <label for="deliverySite">Delivery Site</label>
        <input
          id="deliverySite"
          :value="modelValue.deliverySite"
          placeholder="Type..."
          @input="updateField('deliverySite', $event.target.value)"
        />
      </div>
    </div>

    <div class="form-group full">
      <label for="notes">Notes</label>
      <textarea
        id="notes"
        :value="modelValue.notes"
        placeholder="Type..."
        rows="3"
        @input="updateField('notes', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function updateField(field, value) {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
}
</script>

<style scoped>
.po-header-form {
  margin-bottom: 24px;
}
</style>
