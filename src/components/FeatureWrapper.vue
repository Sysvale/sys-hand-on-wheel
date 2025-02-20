<script>
import { h } from 'vue';

export default {
	inject: ['disabledFeatures'],

	props: {
		feature: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			default: 'hide',
			validator: (value) => ['hide', 'disable', 'overlay'].includes(value),
		},
		blockMessage: {
			type: String,
			default: 'Essa funcionalidade está desabilitada.',
		},
	},

	computed: {
		isDisabled() {
			return this.disabledFeatures.includes(this.feature);
		},

		computedClass() {
			if (!(this.isDisabled && this.mode === 'overlay')) {
				return '';
			}

			return 'feature-wrapper__overlay';
		},

		showSlot() {
			return !this.isDisabled || this.mode !== 'hide';
		},

		computedComponent() {
			if (!this.isDisabled) {
				return 'template';
			}

			switch (this.mode) {
				case 'hide':
					return 'template';
				case 'overlay':
					return 'cds-overlay';
				default:
					return 'template';
			}
		},
	},

	render() {
		const slotProvider = this.$slots;
		const slot = slotProvider.default({
			disabled: this.isDisabled && this.mode === 'disable',
		});

		if (this.mode === 'hide') {
			return h();
		}

		if (this.computedComponent === 'template') {
			return slot;
		}

		return h(
			this.computedComponent,
			{ class: this.computedClass },
			slot,
		);
	},
};
</script>

<style lang="scss" scoped>
.feature-wrapper__overlay {
	background: rgba(0, 0, 0, 0.5);
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
}
</style>
