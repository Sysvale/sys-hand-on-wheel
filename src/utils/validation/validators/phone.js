import mobilePhoneRule from './rules/mobilePhoneRule';
import landlineRule from './rules/landlineRule';

const validator = (value) => {
	if (mobilePhoneRule(value) || landlineRule(value)) {
		return true;
	}

	return 'Informe um telefone válido.';
};

export default validator;
