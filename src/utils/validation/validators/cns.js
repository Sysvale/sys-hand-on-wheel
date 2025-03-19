import validaCartaoSus from './rules/cnsRule';

const validator = (value) => (validaCartaoSus(value) || 'Informe um CNS válido.');
export default validator;
