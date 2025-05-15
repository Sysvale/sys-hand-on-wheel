import mixedLetters from './mixedLetters';
import hasNumber from './hasNumber';
import symbol from './symbol';

const validator = (value) => {
	const mixedLettersValidation = mixedLetters(value);
	if (mixedLettersValidation !== true) {
		return mixedLettersValidation;
	}

	const hasNumberValidation = hasNumber(value);
	if (hasNumberValidation !== true) {
		return hasNumberValidation;
	}

	const symbolValidation = symbol(value);
	if (symbolValidation !== true) {
		return symbolValidation;
	}

	return true;
};

export default validator;
