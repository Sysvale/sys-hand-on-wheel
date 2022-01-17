import swal from 'sweetalert2';
import get$1 from 'lodash.get';
import { isArray, isObject, snakeCase, get } from 'lodash';

var convertKeysToCamelCase = function (data) {
	if (_.isArray(data)) {
		return data.map(function (element) {
			if (_.isObject(element) || _.isArray(element)) {
				return convertKeysToCamelCase(element);
			}
			return element;
		});
	}
	var newData = {};
	Object.keys(data).forEach(function (key) {
		if (_.isObject(data[key]) || _.isArray(data[key])) {
			newData[_.camelCase(key)] = convertKeysToCamelCase(data[key]);
		} else {
			newData[_.camelCase(key)] = data[key];
		}
	});

	return newData;
};

var convertKeysToSnakeCase = function (data) {
	if (isArray(data)) {
		return data.map(function (element) {
			if (isObject(element) || isArray(element)) {
				return convertKeysToSnakeCase(element);
			}
			return element;
		});
	}
	var newData = {};
	Object.keys(data).forEach(function (key) {
		if (isObject(data[key]) || isArray(data[key])) {
			newData[snakeCase(key)] = convertKeysToSnakeCase(data[key]);
		} else {
			newData[snakeCase(key)] = data[key];
		}
	});

	return newData;
};

function getFirstErrorMessage(response, fallbackMsg) {
	if ( fallbackMsg === void 0 ) fallbackMsg = 'Não conseguimos processar sua requisição. Tente novamente.';

	var errors = get(response, 'errors', false);
	if (!errors) { return fallbackMsg; }
	var ref = Object.keys(errors);
	var firstKey = ref[0];
	return errors[firstKey][0] || fallbackMsg;
}

var SUCCESS_SWAL_DEFAULT_CONFIG = {
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
			default: function () { return ({}); },
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
		},
		successFeedbackResolver: {
			type: Function,
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
					function (data) {
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
								get$1(error, 'response.data', null),
								'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
							);

							if (this$1.errorFeedback) {
								this$1.errorFeedback(this$1);
								return;
							}

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
		var slot = this.$scopedSlots.default({
			loading: this.loading,
			failed: this.failed,
			error: this.error,
			data: this.data,
			action: this.action,
			labelHelper: this.labelHelper,
			errorMessage: getFirstErrorMessage(
				get$1(this.error, 'response.data', null),
				'Um erro aconteceu... por favor, tente novamente. Se o erro persistir, contate o suporte.'
			),
		});

		return Array.isArray(slot) ? slot[0] : slot;
	},
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

/* script */
var __vue_script__ = script;

/* template */

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
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
  );



var components = /*#__PURE__*/Object.freeze({
	__proto__: null,
	RequestProvider: __vue_component__
});

// install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }

	install.installed = true;

	Object.defineProperty(Vue.prototype, '_', { value: _ });

	Object.keys(components).forEach(function (componentName) {
		Vue.component(
			("show-" + (componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())),
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
}

export default plugin;
export { __vue_component__ as RequestProvider };
