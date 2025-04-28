import { configure, defineRule } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import { defineRules } from './validation';
import ptBRValidation from './validation/ptBRValidation';

export default (options) => {
	configure({
		inject: true,
		fieldsBagName: 'veeFields',
		generateMessage: localize('pt-BR', {
			messages: ptBRValidation,
		}),
		...options,
	});

	defineRules(defineRule);

	return {
		defineRule,
		configure,
	};
};