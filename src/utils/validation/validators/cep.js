import cepValidate from './rules/cepRule';

const validator = (value) => (cepValidate(value) || 'Informe um CEP válido.');
export default validator;
