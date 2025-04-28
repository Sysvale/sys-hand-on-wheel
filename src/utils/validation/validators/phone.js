const validator = (value) => {
	if (!value) {
		return 'Informe um telefone válido.';
	}

	if (/^\([1-9]{2}\) (?:[2-8]|9[0-9])[0-9]{3}\-[0-9]{4}$/.test(value)) {
		return true;
	}

	return 'Informe um telefone válido.';
};

export default validator;
