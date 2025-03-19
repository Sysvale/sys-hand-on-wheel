import CpfValidate from './rules/cpfRule';

const validator = (value) => (CpfValidate(value) || 'Informe um CPF válido.');

export default validator;
