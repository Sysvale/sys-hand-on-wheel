<script>
import { h } from 'vue';
import keyBy from 'lodash.keyby';
import generateKey from '../utils/generateKey';

const booleanReduceByProp = (arr, prop, operator = '||', defaultValue = false) => arr.reduce((acc, item) => {
	if(operator === '||') {
		return acc || item[prop];
	} else if(operator === '&&') {
		return acc && item[prop];
	}
}, defaultValue);

export default {
	emits: ['success', 'error'],
	props: {
		vid: {
			type: String,
			default: () => generateKey(),
		},
		tag: {
			type: String,
			default: 'div',
		},
	},
	data() {
		return {
			providers: [],
			providersVids: {},
		};
	},
	provide() {
		return {
			$_requestObserver: this,
		}
	},

	computed: {
		context() {
			return {
				vid: this.vid,
				loading: booleanReduceByProp(this.providers, 'loading'),
				failed: booleanReduceByProp(this.providers, 'failed'),
				succeeded: booleanReduceByProp(this.providers, 'succeeded', '&&', true),
				errors: keyBy(this.providers.filter(({ failed }) => failed).map(({ error, vid }) => ({ error, vid })), 'vid'),
				providerRequestState: this.providerRequestState,
				loadingTextResolver: this.loadingTextResolver,
			};
		},

		providerRequestState() {
			return (vid) => {
				const element  = this.providers.find(({ vid: providerVid }) => providerVid === vid);
				return element ? element.requestState : {
					loading: false,
					failed: false,
					succeeded: false,
					error: null,
					data: null,
				};
			}
		},

		loadingTextResolver() {
			return (label, loadingLabel = 'Carregando...') => {
				if (this.context.loading) {
					return loadingLabel;
				}
				return label;
			}
		},
	},

	watch: {
		'context.succeeded': {
			handler(newValue) {
				if (newValue) {
					this.$emit('success', this.context);
				}
			},
		},
		'context.failed': {
			handler(newValue) {
				if (newValue) {
					this.$emit('error', this.context);
				}
			},
		},
	},

	render() {
		const slotProvider = this.$slots;
		const slot = slotProvider.default(this.context);
		return h(this.tag, slot);
	},

	methods: {
		subscribe(provider) {
			if(!this.providersVids[provider.vid]) {
				this.providersVids[provider.vid] = true;
				this.providers.push(provider);
			} else {
				throw new Error(`Provider não reigistrado no observer! Já existe um provider com o vid >> ${provider.vid} <<`);
			}
		},
		unsubscribe(provider) {
			delete this.providersVids[provider.vid];
			this.providers.filter(({ vid }) => vid !== provider.vid);
		},
	},
}
</script>