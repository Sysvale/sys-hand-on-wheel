const validator = (value, [target], ctx) => {
	if (value === ctx.form[target]) {
		return true;
	}
	return 'As senhas devem ser iguais';
};

export default validator;
