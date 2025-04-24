/** Componentes */
import RequestProvider from './RequestProvider.vue';
import RequestObserver from './RequestObserver.vue';
import RequestSelect from './RequestSelect.vue';
import FeatureWrapper from './FeatureWrapper.vue';
/** -------*/

/** Composables */
import { useRequest } from '@/composables/useRequest';
/* -------*/

/** Utils */
import {
    convertKeysToCamelCase,
    convertKeysToSnakeCase,
    removeAccents,
    generateKey,
    toThousands,
} from '../utils';
/* -------*/

export { useRequest };

export default {
    install(app: any, options: any) {
        app.component('ShowRequestProvider', RequestProvider);
        app.component('ShowRequestObserver', RequestObserver);
        app.component('ShowRequestSelect', RequestSelect);
        app.component('ShowFeatureWrapper', FeatureWrapper);
        
        if (options && options.disabledFeatures) {
            app.provide('disabledFeatures', options.disabledFeatures);
        }

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
        }
    },
}