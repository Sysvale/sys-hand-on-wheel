import isObject from 'lodash.isobject';
import snakeCase from 'lodash.snakecase';

const isArray = (arg) => Array.isArray(arg);

const convertKeysToSnakeCase = (data) => {
	if (isArray(data)) {
		return data.map((element) => {
			if (isObject(element) || isArray(element)) {
				return convertKeysToSnakeCase(element);
			}
			return element;
		});
	}
	const newData = {};
	Object.keys(data).forEach((key) => {
		if (isObject(data[key]) || isArray(data[key])) {
			newData[snakeCase(key)] = convertKeysToSnakeCase(data[key]);
		} else {
			newData[snakeCase(key)] = data[key];
		}
	});

	return newData;
};

export default convertKeysToSnakeCase;
