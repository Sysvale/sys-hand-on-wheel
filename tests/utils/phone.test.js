import { describe, expect, test } from 'vitest';
import phone from '../../src/utils/validation/validators/phone';

describe('Check if phone works correctly ', () => {
	test('returns true when a string is a valid phone number', () => {
		expect.assertions(5);

		expect(phone('(11) 91234-5678')).toBe(true);
		expect(phone('(21) 91234-5678')).toBe(true);
		expect(phone('(19) 91234-5678')).toBe(true);
		expect(phone('(28) 91234-5678')).toBe(true);
		expect(phone('(11) 3863-0556')).toBe(true);
	});

	test('returns error message when a string is not a valid phone number', () => {
		expect.assertions(3);

		expect(phone('(21) 91234')).toBe('Informe um telefone válido.');
		expect(phone('(19) 91234-')).toBe('Informe um telefone válido.');
		expect(phone('(28) 91234-')).toBe('Informe um telefone válido.');
	})
});
