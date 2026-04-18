<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fieldErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const opportunityTypes = [
  'internship',
  'scholarship',
  'competition',
  'fellowship',
  'admission',
  'conference',
  'workshop',
  'other'
]

function updateField(field, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

function parseCsvTags(rawValue) {
  return rawValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

const skillsText = computed({
  get: () => (props.modelValue.skills || []).join(', '),
  set: value => updateField('skills', parseCsvTags(value))
})

const interestsText = computed({
  get: () => (props.modelValue.interests || []).join(', '),
  set: value => updateField('interests', parseCsvTags(value))
})

const locationsText = computed({
  get: () => (props.modelValue.preferred_locations || []).join(', '),
  set: value => updateField('preferred_locations', parseCsvTags(value))
})

function toggleOpportunityType(type, checked) {
  const set = new Set(props.modelValue.preferred_opportunity_types || [])
  if (checked) set.add(type)
  else set.delete(type)
  updateField('preferred_opportunity_types', Array.from(set))
}

function isSelectedType(type) {
  return (props.modelValue.preferred_opportunity_types || []).includes(type)
}

function toLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<template>
  <section class="profile-section">
    <h2>Student Profile</h2>

    <div class="field-grid">
      <label>
        <span>Degree Program *</span>
        <input
          :value="props.modelValue.degree_program"
          type="text"
          placeholder="BSc CSE"
          :aria-invalid="Boolean(props.fieldErrors.degree_program)"
          :aria-describedby="props.fieldErrors.degree_program ? 'degree-program-error' : undefined"
          @input="updateField('degree_program', $event.target.value)"
        />
        <small
          v-if="props.fieldErrors.degree_program"
          id="degree-program-error"
          class="field-error"
        >{{ props.fieldErrors.degree_program }}</small>
      </label>

      <label>
        <span>Semester *</span>
        <input
          :value="props.modelValue.semester"
          type="number"
          min="1"
          :aria-invalid="Boolean(props.fieldErrors.semester)"
          :aria-describedby="props.fieldErrors.semester ? 'semester-error' : undefined"
          @input="updateField('semester', Number($event.target.value))"
        />
        <small v-if="props.fieldErrors.semester" id="semester-error" class="field-error">{{ props.fieldErrors.semester }}</small>
      </label>

      <label>
        <span>CGPA</span>
        <input
          :value="props.modelValue.cgpa ?? ''"
          type="number"
          min="0"
          max="4"
          step="0.01"
          placeholder="3.72"
          @input="updateField('cgpa', $event.target.value === '' ? null : Number($event.target.value))"
        />
      </label>

      <label>
        <span>Financial Need</span>
        <select
          :value="String(props.modelValue.financial_need)"
          @change="updateField('financial_need', $event.target.value === 'true')"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label>
    </div>

    <label class="block-field">
      <span>Skills (comma-separated) *</span>
      <input
        v-model="skillsText"
        type="text"
        placeholder="python, vue, sql"
        :aria-invalid="Boolean(props.fieldErrors.skills)"
        :aria-describedby="props.fieldErrors.skills ? 'skills-error' : undefined"
      />
      <small v-if="props.fieldErrors.skills" id="skills-error" class="field-error">{{ props.fieldErrors.skills }}</small>
    </label>

    <label class="block-field">
      <span>Interests (comma-separated) *</span>
      <input
        v-model="interestsText"
        type="text"
        placeholder="ai, backend, research"
        :aria-invalid="Boolean(props.fieldErrors.interests)"
        :aria-describedby="props.fieldErrors.interests ? 'interests-error' : undefined"
      />
      <small v-if="props.fieldErrors.interests" id="interests-error" class="field-error">{{ props.fieldErrors.interests }}</small>
    </label>

    <div class="block-field">
      <span class="field-title">Preferred Opportunity Types *</span>
      <div
        class="checkbox-grid"
        role="group"
        :aria-invalid="Boolean(props.fieldErrors.preferred_opportunity_types)"
        :aria-describedby="props.fieldErrors.preferred_opportunity_types ? 'preferred-types-error' : undefined"
      >
        <label v-for="type in opportunityTypes" :key="type" class="checkbox-item">
          <input
            type="checkbox"
            :checked="isSelectedType(type)"
            @change="toggleOpportunityType(type, $event.target.checked)"
          />
          <span>{{ toLabel(type) }}</span>
        </label>
      </div>
      <small
        v-if="props.fieldErrors.preferred_opportunity_types"
        id="preferred-types-error"
        class="field-error"
      >{{ props.fieldErrors.preferred_opportunity_types }}</small>
    </div>

    <label class="block-field">
      <span>Preferred Locations (comma-separated)</span>
      <input v-model="locationsText" type="text" placeholder="remote, bangladesh" />
    </label>

    <label class="block-field">
      <span>Experience Summary *</span>
      <textarea
        :value="props.modelValue.experience_summary"
        rows="3"
        placeholder="Briefly describe your projects or past experience"
        :aria-invalid="Boolean(props.fieldErrors.experience_summary)"
        :aria-describedby="props.fieldErrors.experience_summary ? 'experience-summary-error' : undefined"
        @input="updateField('experience_summary', $event.target.value)"
      ></textarea>
      <small
        v-if="props.fieldErrors.experience_summary"
        id="experience-summary-error"
        class="field-error"
      >{{ props.fieldErrors.experience_summary }}</small>
    </label>
  </section>
</template>

<style scoped>
.profile-section {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
}

h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.field-grid {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

label {
  display: grid;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.7rem;
  font: inherit;
  color: var(--color-text-primary);
  background: #fff;
}

textarea {
  resize: vertical;
}

.block-field {
  display: grid;
  gap: var(--space-1);
}

.field-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.checkbox-grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
}

.field-error {
  color: var(--color-danger-fg);
}
</style>
