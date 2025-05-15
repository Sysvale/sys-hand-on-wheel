const validator = (value) => {
	if (!value || (/[a-z]/.test(value) && /[A-Z]/.test(value))) {
		return true;
	}

	return 'Este campo deve conter letras maiúsculas e minúsculas';
};

export default validator;
