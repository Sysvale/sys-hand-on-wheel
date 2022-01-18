import get from 'lodash.get';

export default function getFirstErrorMessage(response, fallbackMsg = 'Não conseguimos processar sua requisição. Tente novamente.') {
	const errors = get(response, 'errors', false);
	if (!errors) return fallbackMsg;
	const [firstKey] = Object.keys(errors);
	return errors[firstKey][0] || fallbackMsg;
}
