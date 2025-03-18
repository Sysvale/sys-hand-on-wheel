/** Componentes */
import RequestProvider from './RequestProvider.vue';
import RequestObserver from './RequestObserver.vue';
import RequestSelect from './RequestSelect.vue';
import FormWizard from './FormWizard.vue';
import Form from './Form.vue';
import Field from './Field.vue';
import FeatureWrapper from './FeatureWrapper.vue';
/** -------*/

/** Utils */
import {
    convertKeysToCamelCase,
    convertKeysToSnakeCase,
    removeAccents,
    generateKey,
    toThousands,
    setupVeeValidateWrapper,
} from '../utils';
/* -------*/


export default {
    install(app: any, options = {
        veeValidateOptions: {},
        disabledFeatures: [],
    }) {
        const { veeValidateOptions, disabledFeatures } = options;
        const veeValidateWrapper = setupVeeValidateWrapper(veeValidateOptions);

        if (disabledFeatures.length > 0) {
            app.provide('disabledFeatures', options.disabledFeatures);
        }

        app.component('ShowRequestProvider', RequestProvider);
        app.component('ShowRequestObserver', RequestObserver);
        app.component('ShowRequestSelect', RequestSelect);
        app.component('ShowForm', Form);
        app.component('ShowField', Field);
        app.component('ShowFormWizard', FormWizard);
        app.component('ShowFeatureWrapper', FeatureWrapper);


        const utils = {
            $showConvertKeysToCamelCase: convertKeysToCamelCase,
            $showConvertKeysToSnakeCase: convertKeysToSnakeCase,
            $showRemoveAccents: removeAccents,
            $showGenerateKey: generateKey,
            $showToThousands: toThousands,
        };

        const version = Number(app.version.split('.')[0]);
        
        if (version <= 2) {
            throw new Error('Essa versão só é compatível com projetos que possuem o Vue 3. Para projetos com a Vue 2, utilize a versão 0.3.0 ou inferior');
        }
        
        if (version > 2) {
            // ficará disponível apenas com o uso do Options API
            Object.keys(utils).forEach((key: string) => {
                app.config.globalProperties[key] = utils[key];
            });

            // wrapper do vee-validate  
            app.config.globalProperties.$showVeeValidate = veeValidateWrapper;
        }
    },
}