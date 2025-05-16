export default (value) => !value || /^\([1-9]{2}\) (9[0-9]{4}-[0-9]{4})$/.test(value);
