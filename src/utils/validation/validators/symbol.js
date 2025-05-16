const validator = (value) => {
	if (!value || (/[!@#$%&*]/.test(value))) {
		return true;
	}

	return 'O campo deve conter ao menos um símbolo (!@#$%&*)';
};

export default validator;
