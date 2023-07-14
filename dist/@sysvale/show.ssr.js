'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var swal=_interopDefault(require('sweetalert2')),get=_interopDefault(require('lodash.get')),camelCase=_interopDefault(require('lodash.camelcase')),isObject=_interopDefault(require('lodash.isobject')),snakeCase=_interopDefault(require('lodash.snakecase'));var isArray = function (arg) { return Array.isArray(arg); };

var convertKeysToCamelCase = function (data) {
	if (isArray(data)) {
		return data.map(function (element) {
			if (isObject(element) || isArray(element)) {
				return convertKeysToCamelCase(element);
			}
			return element;
		});
	}
	var newData = {};
	Object.keys(data).forEach(function (key) {
		if (isObject(data[key]) || isArray(data[key])) {
			newData[camelCase(key)] = convertKeysToCamelCase(data[key]);
		} else {
			newData[camelCase(key)] = data[key];
		}
	});

	return newData;
};var isArray$1 = function (arg) { return Array.isArray(arg); };

var convertKeysToSnakeCase = function (data) {
	if (isArray$1(data)) {
		return data.map(function (element) {
			if (isObject(element) || isArray$1(element)) {
				return convertKeysToSnakeCase(element);
			}
			return element;
		});
	}
	var newData = {};
	Object.keys(data).forEach(function (key) {
		if (isObject(data[key]) || isArray$1(data[key])) {
			newData[snakeCase(key)] = convertKeysToSnakeCase(data[key]);
		} else {
			newData[snakeCase(key)] = data[key];
		}
	});

	return newData;
};function getFirstErrorMessage(response, fallbackMsg) {
	if ( fallbackMsg === void 0 ) fallbackMsg = 'Não conseguimos processar sua requisição. Tente novamente.';

	var errors = get(response, 'errors', false);
	if (!errors) { return fallbackMsg; }
	var ref = Object.keys(errors);
	var firstKey = ref[0];
	return errors[firstKey][0] || fallbackMsg;
}var SUCCESS_SWAL_DEFAULT_CONFIG = {
	title: 'Informações salvas com sucesso!',
	icon: 'success',
	text: '',
	showCloseButton: true,
	confirmButtonText: 'Ok',
};

var ERROR_SWAL_DEFAULT_CONFIG = {
	icon: 'error',
	title: 'Erro',
	text: 'mensagem de error',
	showCancelButton: true,
	showConfirmButton: false,
	cancelButtonText: 'Fechar',
};

var script = {
	props: {
		service: {
			type: Function,
			required: true,
		},
		payload: {
			type: Object,
			default: function () { return ({}); },
		},
		payloadResolver: {
			type: Function,
			default: function (data) { return convertKeysToSnakeCase(data); },
		},
		dataResolver: {
			type: Function,
			default: function (data) { return convertKeysToCamelCase(data); },
		},
		successSwalConfig: {
			type: Object,
			default: function () { return SUCCESS_SWAL_DEFAULT_CONFIG; },
		},
		errorSwalConfig: {
			type: Object,
			default: function () { return ERROR_SWAL_DEFAULT_CONFIG; },
		},
		errorFeedbackResolver: {
			type: Function,
			default: null,
		},
		successFeedbackResolver: {
			type: Function,
			default: null,
		},
		showSuccessFeedback: {
			type: Boolean,
			default: false,
		},
		hideErrorFeedback: {
			type: Boolean,
			default: false,
		},
		immediate: {
			type: Boolean,
			default: false,
		},
		forceResetError: {
			type: Boolean,
			default: false,
		},
		initialData: {
			default: null,
		},
	},

	data: function data() {
		return {
			loading: false,
			failed: false,
			error: null,
			data: this.initialData,
		};
	},

	watch: {
		forceResetError: function forceResetError(newValue) {
			if (newValue) {
				this.error = null;
			}
		},
	},

	mounted: function mounted() {
		if (this.immediate) {
			this.action();
		}
	},

	methods: {
		action: function action(payloadFromArgs) {
			var this$1 = this;

			this.startRequest();
			var payload = payloadFromArgs || this.payload;
			this.service(this.payloadResolver(payload))
				.then(
					function (ref) {
						var data = ref.data;

						this$1.data = this$1.dataResolver(data);
						this$1.$emit('success', this$1.data);

						if (this$1.showSuccessFeedback) {
							if (this$1.successFeedbackResolver) {
								this$1.successFeedbackResolver({ vm: this$1, data: this$1.data });
								return;
							}
							swal.fire(Object.assign({}, SUCCESS_SWAL_DEFAULT_CONFIG,
								this$1.successSwalConfig)).then(function () {
								this$1.$emit('success-feedback-ok', this$1.data);
							});
						}
					}
				).catch(
					function (error) {
						this$1.failed = true;
						this$1.error = error;
						this$1.$emit('error', error);

						if (!this$1.hideErrorFeedback) {
							var errorMessage = getFirstErrorMessage(
								get(error, 'response.data', null),
								'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
							);

							if (this$1.errorFeedbackResolver) {
								this$1.errorFeedbackResolver({ vm: this$1, error: error, errorMessage: errorMessage });
								return;
							}

							swal.fire(Object.assign({}, ERROR_SWAL_DEFAULT_CONFIG,
								this$1.errorSwalConfig,
								{text: errorMessage})).then(function (result) {
								if (result.isDismissed) {
									this$1.$emit('error-feedback-cancel', error);
								}
								if (result.isConfirmed) {
									this$1.$emit('error-feedback-ok', error);
								}
							});
						}
					}
				).finally(function () {
					this$1.loading = false;
				});
		},

		labelHelper: function labelHelper(label, loadingLabel) {
			if ( loadingLabel === void 0 ) loadingLabel = 'Carregando...';

			if (this.loading) {
				return loadingLabel;
			}
			return label;
		},

		startRequest: function startRequest() {
			this.loading = true;
			this.failed = false;
			this.error = null;
		},
	},

	render: function render() {
		var slotProvider = this.$scopedSlots || this.$slots;
		var slot = slotProvider.default({
			loading: this.loading,
			failed: this.failed,
			error: this.error,
			data: this.data,
			action: this.action,
			labelHelper: this.labelHelper,
			errorMessage: getFirstErrorMessage(
				get(this.error, 'response.data', null),
				'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
			),
		});

		return Array.isArray(slot) ? slot[0] : slot;
	},
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}/* script */
var __vue_script__ = script;

/* template */

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = "data-v-1c63dfe6";
  /* functional template */
  var __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );var SUCCESS_SWAL_DEFAULT_CONFIG$1 = {
	title: 'Informações salvas com sucesso!',
	icon: 'success',
	text: '',
	showCloseButton: true,
	confirmButtonText: 'Ok',
};

var ERROR_SWAL_DEFAULT_CONFIG$1 = {
	icon: 'error',
	title: 'Erro',
	text: 'mensagem de error',
	showCancelButton: true,
	showConfirmButton: false,
	cancelButtonText: 'Fechar',
};

var script$1 = {
	props: {
		services: {
			type: Object,
			required: true,
		},
		payloads: {
			type: Object,
			default: function () { return ({}); },
		},
		payloadResolvers: {
			type: Object,
			default: function () { return ({}); },
		},
		dataResolvers: {
			type: Object,
			default: function () { return ({}); },
		},
		successSwalConfigs: {
			type: Object,
			default: function () { return ({}); },
		},
		errorSwalConfigs: {
			type: Object,
			default: function () { return ({}); },
		},
		errorFeedbackResolvers: {
			type: Function,
			default: null,
		},
		successFeedbackResolver: {
			type: Function,
			default: null,
		},
		showSuccessFeedback: {
			type: Array,
			default: function () { return []; },
		},
		hideErrorFeedback: {
			type: Array,
			default: function () { return []; },
		},
		immediate: {
			type: Array,
			default: function () { return []; },
		},
		forceResetError: {
			type: Boolean,
			default: false,
		},
		initialData: {
			default: null,
		},
	},

	data: function data() {
		return {
			loading: {},
			failed: {},
			error: {},
			data: Object.assign({}, (this.initialData || {})),
		};
	},

	watch: {
		forceResetError: function forceResetError(newValue) {
			if (newValue) {
				this.error = null;
			}
		},
	},

	beforeCreate: function beforeCreate() {
		var this$1 = this;

		var ref = this.$options.propsData;
		var services = ref.services;
		var payloads = ref.payloads;
		var payloadResolvers = ref.payloadResolvers;
		var dataResolvers = ref.dataResolvers;
		var successSwalConfigs = ref.successSwalConfigs;
		var errorFeedbackResolvers = ref.errorFeedbackResolvers;
		var errorSwalConfigs = ref.errorSwalConfigs;

		Object.keys(services).forEach(function (serviceKey) {
			var obj;

			this$1.$options.methods = Object.assign(( obj = {}, obj[(serviceKey + "Action")] = function () {
					this$1.$options.data.loading[serviceKey] = true;
					this$1.$options.data.failed[serviceKey] = false;
					this$1.$options.data.error[serviceKey] = null;

					var payload = payloads[serviceKey]; // n tem payload from args
					this$1.service(payloadResolvers[serviceKey](payload))
						.then(
							function (ref) {
								var data = ref.data;

								this$1.data[serviceKey] = dataResolvers[serviceKey](data);
								this$1.$emit('success', { serviceKey: serviceKey, data: this$1.data });

								if (this$1.showSuccessFeedback) {
									if (this$1.successFeedbackResolver) {
										this$1.successFeedbackResolver({ vm: this$1, data: this$1.data[serviceKey], serviceKey: serviceKey });
										return;
									}
									swal.fire(Object.assign({}, SUCCESS_SWAL_DEFAULT_CONFIG$1,
										successSwalConfigs[serviceKey])).then(function () {
										this$1.$emit('success-feedback-ok', { data: this$1.data[serviceKey], serviceKey: serviceKey });
									});
								}
							}
						).catch(
							function (error) {
								this$1.$options.data.failed[serviceKey] = true;
								this$1.$options.data.error[serviceKey] = error;
								this$1.$emit('error', { error: error, serviceKey: serviceKey });

								if (!this$1.hideErrorFeedback) {
									var errorMessage = getFirstErrorMessage(
										get(error, 'response.data', null),
										'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
									);

									if (errorFeedbackResolvers[serviceKey]) {
										errorFeedbackResolvers[serviceKey]({
											vm: this$1,
											error: error,
											errorMessage: errorMessage,
											serviceKey: serviceKey,
										});
										return;
									}

									swal.fire(Object.assign({}, ERROR_SWAL_DEFAULT_CONFIG$1,
										errorSwalConfigs[serviceKey],
										{text: errorMessage})).then(function (result) {
										if (result.isDismissed) {
											this$1.$emit('error-feedback-cancel', { error: error, serviceKey: serviceKey });
										}
										if (result.isConfirmed) {
											this$1.$emit('error-feedback-ok', { error: error, serviceKey: serviceKey });
										}
									});
								}
							}
						).finally(function () {
							this$1.$options.data.loading[serviceKey] = false;
						});
				}, obj ),
				this$1.$options.methods);
		});
	},

	mounted: function mounted() {
		var this$1 = this;

		this.immediate.forEach(function (serviceKey) {
			this$1[(serviceKey + "Action")]();
		});
	},

	methods: {
		labelHelper: function labelHelper(label, loadingLabel) {
			if ( loadingLabel === void 0 ) loadingLabel = 'Carregando...';

			if (this.loading) {
				return loadingLabel;
			}
			return label;
		},

		payloadResolverFallback: function payloadResolverFallback(payloadResolver) {
			return payloadResolver || convertKeysToSnakeCase;
		},

		dataResolverFallback: function dataResolverFallback(payloadResolver) {
			return payloadResolver || convertKeysToCamelCase;
		},
	},

	render: function render() {
		var slotProvider = this.$scopedSlots || this.$slots;
		var slot = slotProvider.default({
			loading: this.loading,
			failed: this.failed,
			error: this.error,
			data: this.data,
			action: this.action,
			labelHelper: this.labelHelper,
			errorMessage: getFirstErrorMessage(
				get(this.error, 'response.data', null),
				'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
			),
		});

		return Array.isArray(slot) ? slot[0] : slot;
	},
};/* script */
var __vue_script__$1 = script$1;

/* template */

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = "data-v-71e5dd38";
  /* functional template */
  var __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );var components=/*#__PURE__*/Object.freeze({__proto__:null,RequestProvider: __vue_component__,MultipleRequestsProvider: __vue_component__$1});function removeAccents(str) {
	if ( str === void 0 ) str = '';

	var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
	var strLen = str.length;
	var newStr = str.split('');
	var x;

	for (var i = 0; i < strLen; i += 1) {
		x = accents.indexOf(str[i]);
		if (x !== -1) {
			newStr[i] = accentsOut[x];
		}
	}

	newStr = newStr.join('');
	newStr = newStr.split('.').join('');
	newStr = newStr.split('-').join('');
	newStr = newStr.split('/').join('');

	return newStr;
}function generateKey(length) {
	if ( length === void 0 ) length = 8;

	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}var utils = {
	$showConvertKeysToCamelCase: convertKeysToCamelCase,
	$showConvertKeysToSnakeCase: convertKeysToSnakeCase,
	$showRemoveAccents: removeAccents,
	$showGenerateKey: generateKey,
};

// install function executed by Vue.use()
function install(app) {
	if (install.installed) { return; }

	install.installed = true;

	var version = Number(app.version.split('.')[0]);

	if (version <= 2) {
		Object.keys(utils).forEach(function (key) {
			app.prototype[key] = utils[key];
		});
	}

	if (version > 2) {
		// ficará disponível apenas com o uso do Options API
		Object.keys(utils).forEach(function (key) {
			app.config.globalProperties[key] = utils[key];
		});
	}

	Object.keys(components).forEach(function (componentName) {
		app.component(
			("Show" + componentName),
			components[componentName]
		);
	});
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// To auto-install when vue is found
/* global window global */
var GlobalVue = null;

if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(plugin);
}exports.MultipleRequestsProvider=__vue_component__$1;exports.RequestProvider=__vue_component__;exports.default=plugin;