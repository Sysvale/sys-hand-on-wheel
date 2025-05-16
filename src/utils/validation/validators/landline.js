import landlineRule from './rules/landlineRule';

const validator = (value) => {
	if (!value || landlineRule(value)) {
		return true;
	}

	return 'Informe um telefone válido.';
};

export default validator;
