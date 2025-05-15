import { describe, test, expect } from 'vitest';
import strongPassword from '../../src/utils/validation/validators/strongPassword';

describe('Check if strongPassword works correctly ', () => {
	test('returns true when a string is strong', () => {
		expect.assertions(1);

		expect(strongPassword('Abc123!@')).toBe(true);
	});

	test('returns message error when a string is not strong', () => {
		expect.assertions(3);

		expect(strongPassword('Abc123')).toBe('O campo deve conter ao menos um símbolo (!@#$%&*)');
		expect(strongPassword('Abc')).toBe('O campo deve conter ao menos um número');
		expect(strongPassword('abc')).toBe('Este campo deve conter letras maiúsculas e minúsculas');
	});
});
