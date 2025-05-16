import mobilePhoneRule from './rules/mobilePhoneRule';

const validator = (value) => {
	if (!value || mobilePhoneRule(value)) {
		return true;
	}

	return 'Informe um telefone válido.';
};

export default validator;
