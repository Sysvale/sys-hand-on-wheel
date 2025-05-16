import { describe, expect, test } from 'vitest';
import hasNumber from '../../src/utils/validation/validators/hasNumber';

describe('Check if hasNumber works correctly ', () => {
	test('returns true when a string has a number', () => {
		expect.assertions(4);

		expect(hasNumber('Abc123')).toBe(true);
		expect(hasNumber(123)).toBe(true);
		expect(hasNumber(undefined)).toBe(true);
		expect(hasNumber(null)).toBe(true);
	});

	test('returns message error when a string does not have a number', () => {
		expect.assertions(1);

		expect(hasNumber('Abc')).toBe('O campo deve conter ao menos um número');
	})
});
