import {
	email,
	required,
	min,
	max,
	numeric,
	min_value,
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
import mixedLetters from './validators/mixedLetters';
import hasNumber from './validators/hasNumber';
import symbol from './validators/symbol';
import strongPassword from './validators/strongPassword';

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
	defineRules('min_value', min_value);
	defineRule('number', numeric);
	defineRule('password_confirmation', passwordConfirmation);
	defineRule('phone', phone);
	defineRule('landline', landline);
	defineRule('mobile_phone', mobilePhoneRule);
	defineRule('mixed_letters', mixedLetters);
	defineRule('has_number', hasNumber);
	defineRule('symbol', symbol);
	defineRule('strong_password', strongPassword);
};
