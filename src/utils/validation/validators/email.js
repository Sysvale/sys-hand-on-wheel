const validator = (value) => {
	value = value.trim();

	if (!value || !value.length) {
		return true;
	}

	if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
		return 'O campo deve conter um e-email válido';
	}
	return true;
};

export default validator;
