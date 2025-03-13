const cepValidate = function (cep) {
	if (!cep) {
		return true;
	}
	return /^\d{8}$/.test(cep.replace(/[^\d]+/g, ''));
};
export default cepValidate;
