import { describe, expect, test } from 'vitest';
import mobilePhone from '../../src/utils/validation/validators/mobilePhone';

describe('Check if mobilePhone works correctly ', () => {
	test('returns true when a string is a valid mobile phone number', () => {
		expect.assertions(4);

		expect(mobilePhone('(11) 91234-5678')).toBe(true);
		expect(mobilePhone('(21) 91234-5678')).toBe(true);
		expect(mobilePhone('(19) 91234-5678')).toBe(true);
		expect(mobilePhone('(28) 91234-5678')).toBe(true);
	});

	test('returns error message when a string is not a valid mobile phone number', () => {
		expect.assertions(3);

		expect(mobilePhone('(11) 3863-0556')).toBe('Informe um telefone válido.');
		expect(mobilePhone('(21) 91234')).toBe('Informe um telefone válido.');
		expect(mobilePhone('(19) 91234-')).toBe('Informe um telefone válido.');
	})
});
