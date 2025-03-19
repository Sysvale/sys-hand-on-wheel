const validator = (value) => /^[a-zA-ZÀ-ÿ0-9 ]*$/.test(value) || 'Este campo deve conter apenas letras e/ou números.';

export default validator;
