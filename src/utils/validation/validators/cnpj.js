import CnpjValidate from './rules/cnpjRule';

const validator = (value) => (CnpjValidate(value) || 'Informe um CNPJ válido.');

export default validator;
