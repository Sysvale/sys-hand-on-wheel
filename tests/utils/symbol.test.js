import { describe, expect, test } from 'vitest';
import symbol from '../../src/utils/validation/validators/symbol';

describe('Check if symbol works correctly ', () => {
	test('returns true when a string has a symbol', () => {
		expect.assertions(4);

		expect(symbol('Abc!')).toBe(true);
		expect(symbol('Abc@')).toBe(true);
		expect(symbol('')).toBe(true);
		expect(symbol(undefined)).toBe(true);
	});

	test('returns message error when a string does not have a symbol', () => {
		expect.assertions(1);

		expect(symbol('Abc')).toBe('O campo deve conter ao menos um símbolo (!@#$%&*)');
	})
});
