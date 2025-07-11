import camelCase from 'lodash.camelcase';
import isObject from 'lodash.isobject';

const isArray = (arg) => Array.isArray(arg);

const convertKeysToCamelCase = (data) => {
	if (isArray(data)) {
		return data.map((element) => {
			if ((isObject(element) || isArray(element)) && !(element instanceof File)) {
				return convertKeysToCamelCase(element);
			}
			return element;
		});
	}
	const newData = {};
	Object.keys(data).forEach((key) => {
		if ((isObject(data[key]) || isArray(data[key])) && !(data[key] instanceof File)) {
			newData[camelCase(key)] = convertKeysToCamelCase(data[key]);
		} else {
			newData[camelCase(key)] = data[key];
		}
	});

	return newData;
};

export default convertKeysToCamelCase;
