import { describe, expect, test } from 'vitest';
import landline from '../../src/utils/validation/validators/landline';

describe('Check if landline works correctly ', () => {
	test('returns true when a string is a valid landline phone number', () => {
		expect.assertions(4);

		expect(landline('(11) 3224-5678')).toBe(true);
		expect(landline('(21) 3224-5678')).toBe(true);
		expect(landline('(19) 3224-5678')).toBe(true);
		expect(landline('(28) 3224-5678')).toBe(true);
	});

	test('returns error message when a string is not a valid landline phone number', () => {
		expect.assertions(4);

		expect(landline('(11) 93224-5672')).toBe('Informe um telefone válido.');
		expect(landline('(11) 3224-567')).toBe('Informe um telefone válido.');
		expect(landline('(21) 3224-')).toBe('Informe um telefone válido.');
		expect(landline('(19) 3224-')).toBe('Informe um telefone válido.');
	})
});
