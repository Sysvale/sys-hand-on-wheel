import {
	email,
	required,
	min,
	max,
	numeric,
} from '@vee-validate/rules';

import alphaNumSpaces from './validators/alphaNumSpaces';
import cep from './validators/cep';
import cnpj from './validators/cnpj';
import cns from './validators/cns';
import cpf from './validators/cpf';
import name from './validators/name';
import passwordConfirmation from './validators/passwordConfirmation';
import phone from './validators/phone';
import mobilePhoneRule from './validators/mobilePhone';
import landline from './validators/rules/landline';


export const defineRules = (defineRule) => {
	defineRule('alpha_num_spaces', alphaNumSpaces);	
	defineRule('cep', cep);
	defineRule('cnpj', cnpj);
	defineRule('cns', cns);
	defineRule('cpf', cpf);
	defineRule('email', email);
	defineRule('name', name);
	defineRule('required', required);
	defineRule('max', max);
	defineRule('min', min);
	defineRule('number', numeric);
	defineRule('password_confirmation', passwordConfirmation);
	defineRule('phone', phone);
	defineRule('landline', landline);
	defineRule('mobile_phone', mobilePhoneRule);
};
