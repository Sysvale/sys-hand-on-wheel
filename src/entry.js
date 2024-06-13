import * as components from './components/index';
import {
	convertKeysToCamelCase,
	convertKeysToSnakeCase,
	removeAccents,
	generateKey,
} from './utils';

const utils = {
	$showConvertKeysToCamelCase: convertKeysToCamelCase,
	$showConvertKeysToSnakeCase: convertKeysToSnakeCase,
	$showRemoveAccents: removeAccents,
	$showGenerateKey: generateKey,
};

// install function executed by Vue.use()
function install(app) {
	if (install.installed) return;

	install.installed = true;

	const version = Number(app.version.split('.')[0]);

	if (version <= 2) {
		throw new Error('Essa versão só é compatível com projetos que possuem o Vue 3. Para projetos com a Vue 2, utilize a versão 0.3.0 ou inferior');
	}

	if (version > 2) {
		// ficará disponível apenas com o uso do Options API
		Object.keys(utils).forEach((key) => {
			app.config.globalProperties[key] = utils[key];
		});
	}

	Object.keys(components).forEach((componentName) => {
		app.component(
			`Show${componentName}`,
			components[componentName],
		);
	});
}

// Create module definition for Vue.use()
const plugin = {
	install,
};

// To auto-install when vue is found
/* global window global */
let GlobalVue = null;

if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(plugin);
}

// Default export is library as a whole, registered via Vue.use()
export default plugin;
// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './components/index';
