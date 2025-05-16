import { describe, expect, test } from 'vitest';
import mixedLetters from '../../src/utils/validation/validators/mixedLetters';

describe('Check if mixedLetters works correctly ', () => {    
	test('returns true when a string is mixed', () => {
		expect.assertions(3);

		expect(mixedLetters('Abc')).toBe(true);
		expect(mixedLetters(null)).toBe(true);
		expect(mixedLetters('')).toBe(true);
	});

	test('returns false when a string is not mixed', () => {
			const errorMessage = 'Este campo deve conter letras maiúsculas e minúsculas';

			expect.assertions(2)

			expect(mixedLetters(123)).toBe(errorMessage);
			expect(mixedLetters('abc')).toBe(errorMessage);
	});
});
