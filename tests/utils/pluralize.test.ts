import { describe, test, expect } from 'vitest';
import { pluralize, pluralizeWithCount } from '../../src/utils/pluralize'; // Adjust the path

describe('pluralize()', () => {
	test('returns same word if count is 1', () => {
		expect(pluralize(1, 'carro')).toBe('carro');
	});

	test('adds "s" for regular words ending in vowel', () => {
		expect(pluralize(2, 'banana')).toBe('bananas');
	});

	test('uses custom suffix if provided', () => {
		expect(pluralize(2, 'livro', 'zinhos')).toBe('livrozinhos');
	});

	test('does not change words ending in s or x', () => {
		expect(pluralize(3, 'tórax')).toBe('tórax');
		expect(pluralize(3, 'lápis')).toBe('lápis');
	});

	test('converts -ão to -ões', () => {
		expect(pluralize(2, 'pão')).toBe('pões');
	});

	test('converts -m to -ns', () => {
		expect(pluralize(2, 'homem')).toBe('homens');
	});

	test('adds "es" for words ending in r or z', () => {
		expect(pluralize(2, 'luz')).toBe('luzes');
		expect(pluralize(2, 'motor')).toBe('motores');
	});

	test('converts -al, -ol, -ul to -ais, -ois, -uis', () => {
		expect(pluralize(2, 'animal')).toBe('animais');
		expect(pluralize(2, 'sol')).toBe('sois');
		expect(pluralize(2, 'azul')).toBe('azuis');
	});

	test('converts -el to -éis', () => {
		expect(pluralize(2, 'papel')).toBe('papéis');
	});

	test('converts -il to -is', () => {
		expect(pluralize(2, 'fuzil')).toBe('fuzis');
	});

	test('uses plural when count is negative', () => {
		expect(pluralize(-3, 'avião')).toBe('aviões');
	});

	test('does not use plural when count is zero', () => {
		expect(pluralize(0, 'mapa')).toBe('mapa');
	});

	test('defaults count to 2 if null or undefined', () => {
		expect(pluralize(null, 'livro')).toBe('livros');
	});

	test('treats first param as word if count is a string', () => {
		expect(pluralize('carro', '', 's')).toBe('carros');
	});
});

describe('pluralizeWithCount()', () => {
	test('includes the count in the result', () => {
		expect(pluralizeWithCount(1, 'carro')).toBe('1 carro');
		expect(pluralizeWithCount(2, 'carro')).toBe('2 carros');
	});

	test('works with custom suffix', () => {
		expect(pluralizeWithCount(2, 'livro', 'zinhos')).toBe('2 livrozinhos');
	});
});
