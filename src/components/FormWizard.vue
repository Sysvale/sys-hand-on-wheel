<template>
	<div class="form-wizard">
		<cds-stepper
			:steps="computedHeaders"
			:value="currentHeaderStep"
			disable-on-click
		/>
		<cds-spacer :margin-bottom="4" />
		<template
			v-for="step in internalSteps"
			:key="step.id"
		>
			<Form
				v-show="step.id === currentStepId"
				keep-values
				:ref="(el) => forms[step.id] = el"
				:initial-values="model[step.id]"
			>
				<component
					:is="step.component"
					:step-values="model[step.id]"
					:is-active="step.id === currentStepId"
				/>
			</Form>
		</template>
		<cds-spacer :margin-bottom="4" />
		<cds-flexbox
			gap="2"
		>
			<cds-button
				:disabled="isFirstStep || disablePreviousButton"
				secondary
				:size="navigationButtonsSize"
				@button-click="goToPreviousStep"
			>
				Anterior
			</cds-button>
			<cds-button
				:disabled="disableNextButton"
				:variant="nextButtonVariant"
				:size="navigationButtonsSize"
				@button-click="handleNextStep"
			>
				{{ nextButtonLabelResolver(isLastStep) }}
			</cds-button>
		</cds-flexbox>
	</div>
</template>
  
<script setup>
import { Form } from 'vee-validate';
import { ref, computed, watch, onMounted, defineEmits, provide } from 'vue';
import keyBy from 'lodash.keyby';

const props = defineProps({
	steps: {
		type: Array,
		required: true,
	},
	initialStepId: {
		type: String,
		default: null,
	},
	disableNextButton: {
		type: Boolean,
		default: false,
	},
	disablePreviousButton: {
		type: Boolean,
		default: false,
	},
	nextButtonLabelResolver: {
		type: Function,
		default: (isLastStep) => isLastStep ? 'Enviar' : 'Próximo',
	},
	previousButtonLabelResolver: {
		type: Function,
		default: (isFirstStep) => isFirstStep ? 'Anterior' : 'Anterior',
	},
	nextResolver: {
		type: Function,
		default: (values, next) => new Promise((resolve) => {
			next();
			resolve(values);
		}),
	},
	navigationButtonsSize: {
		type: String,
		default: 'md',
	},
	nextButtonVariant: {
		type: String,
		default: 'green',
	}
});

const emit = defineEmits(['next', 'previous', 'submit']);

provide('$resetField', (field, formId) => {
	const stepId = formId || currentStepId.value;
	if(
		!forms.value[stepId]
		|| !forms.value[stepId].resetField
	) {
		return;
	}

	forms.value[stepId].resetField(field);
});

provide('$setFieldValue', (field, value, formId) => {
	const stepId = formId || currentStepId.value;
	forms.value[stepId].setFieldValue(field, value);
});

provide('$getValues', (stepId = null) => {
	if(!stepId) {
		return model.value;
	}

	return forms.value?.[stepId]?.getValues() || null;
});

const model = defineModel();
const forms = ref({});
const headers = ref([]);
const validationState = ref({});
const currentStepId = ref(props.initialStepId || props.steps[0].id);
const internalSteps = computed(() => props.steps.map((step) => ({
		...step,
		$nextStep: () => {
			const nextStepId = typeof step.nextStep === 'function'
				? step.nextStep(model.value)
				: step.nextStep || getNextStepIdFromArray(step.id);

			return stepMap.value[nextStepId];
		},
})));

const stepMap = computed(() => keyBy(internalSteps.value, 'id'));

const computedHeaders = computed(() => {
	return headers.value.map((header) => {
		const validated = validationState.value && validationState.value[header.id]?.validated;
		const valid = validationState.value && validationState.value[header.id]?.valid;
		return {
			...header,
			completed: validated && valid,
			error: validated && !valid,
			inProcessing: !validated && header.id === currentStepId.value,
		}
	});
});

const currentStep = computed(() => stepMap.value[currentStepId.value]);

const currentHeaderStep = computed(() => headers.value.findIndex(({ id }) => currentStepId.value === id) + 1);

const progress = computed(() => calculateProgress());
  
const isFirstStep = computed(() => currentStepId.value === internalSteps.value[0].id);
  
const isLastStep = computed(() => {
	if (currentStep.value.$nextStep() === 'end') return true;
	const currentIndex = internalSteps.value.findIndex((step) => step.id === currentStepId.value);
	return currentIndex === internalSteps.value.length - 1;
});

watch(() => forms.value[currentStepId.value]?.values, (newValues) => {
	const updatedModel = {
		...model.value,
		[currentStepId.value]: newValues,
	};

	const allowedKeys = headers.value.map(({ id }) => id);
	const filteredModel = allowedKeys.reduce((acc, key) => {
		acc[key] = updatedModel[key];
		return acc;
	}, {});

	model.value = { ...filteredModel };

}, { immediate: true, deep: true });

onMounted(() => {
	buildHeaders();
	initializeValues();
});

const buildHeaders = () => {
	headers.value = [];

	const firstStepId = props.steps[0].id;
	let step = stepMap.value[firstStepId];

	while (step && step.$nextStep() !== 'end') {
		insertHeader(step);
		step = step.$nextStep();
	}
};

const insertHeader = ({ label, id }) => headers.value.push({ label, id });

const initializeValues = () => {
	const output = {};
	headers.value.forEach((header) => {
		output[header.id] = forms.value[header.id]?.values || {};;
		
		validationState.value = {
			...validationState.value,
			[header.id]: {
				validated: false,
				valid: false,
			},
		};
	});
	model.value = { ...output };
}
  
const calculateProgress = () => {
	const steps = internalSteps.value;
	let totalSteps = 0;
	let currentStepIndex = 0;

	let step = stepMap.value[steps[0].id];
	while(step) {
		totalSteps++;

		if (step.id === currentStepId.value) {
			currentStepIndex = totalSteps;
		}

		if(step.$nextStep()?.id === 'end') break;
		step = step.$nextStep();
	}

	return totalSteps === 0 ? 0 : (currentStepIndex / totalSteps) * 100;
}
  
const handleNextStep = async () => {
	const state = await forms.value[currentStepId.value].validate();

	validationState.value[currentStepId.value] = {
		validated: true,
		valid: state.valid,
	};

	const next = () => {
		buildHeaders();
		goToNextStep();
	}

	if(state.valid) {
		const nextResolver = currentStep.value?.nextResolver ?? props.nextResolver;
		await nextResolver(
			{
				step: currentStepId.value,
				values: forms.value[currentStepId.value].getValues()
			},
			next,
			state.valid,
		);
	}

}

const goToNextStep = () => {
	const nextStep = currentStep.value.$nextStep();
	if(!nextStep) {
		emit('submit', model.value);
		return;
	};
	const previousStep = { ...currentStep.value };
	currentStepId.value = nextStep.id;
	emit('next', { nextStep, previousStep });
	headers.value.find((step) => step.id === currentStepId.value).inProcessing = true;
}
  
const goToPreviousStep = () => {
	const previousStep = internalSteps.value.find((step) => step.$nextStep().id === currentStepId.value);
	if (previousStep) {
		currentStepId.value = previousStep.id;
		emit('previous', currentStep);
	}
}

const getNextStepIdFromArray = (currentStepId) => {
	const steps = internalSteps.value;
	const currentIndex = steps.findIndex((step) => step.id === currentStepId);
	if (currentIndex < steps.length - 1) {
		return steps[currentIndex + 1].id;
	}
	return 'end';
}

defineExpose({
	progress,
});
</script>

