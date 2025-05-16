const validator = (value) => {
	if (!value || (/[0-9]/.test(value))) {
		return true;
	}

	return 'O campo deve conter ao menos um número';
};

export default validator;