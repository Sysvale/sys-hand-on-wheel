const validator = (value) => {
	if (!(value.trim().split(' ').length >= 2)) {
		return 'O campo nome deve conter um nome completo';
	}

	if (/\d/.test(value)) {
		return 'O campo nome não deve conter digitos';
	}

	if (!/^[a-zA-ZÀ-ÿ]+[a-zA-ZÀ-ÿ\s'\-\.]+$/u.test(value)) {
		return 'O campo nome deve ser um nome válido';
	}

	return true;
};

export default validator;
