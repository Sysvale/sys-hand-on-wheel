import { describe, test, expect } from 'vitest';
import { pluralize, pluralizeWords, pluralizeWithCount } from '../../src/utils/pluralize'; // Adjust the path

describe('pluralize()', () => {
	test('returns same word if count is 1', () => {
		expect(pluralize(1, 'carro')).toBe('carro');
	});

	test('adds "s" for regular words ending in vowel', () => {
		expect(pluralize(2, 'banana')).toBe('bananas');
	});

	test('uses custom plural if provided', () => {
		expect(pluralize(2, 'livro')).not.toBe('livrozinhos');
		expect(pluralize(2, 'livro', 'livrozinhos')).toBe('livrozinhos');
	});

	test('does not change words ending in s or x', () => {
		expect(pluralize(3, 'tórax')).toBe('tórax');
		expect(pluralize(3, 'lápis')).toBe('lápis');
	});

	test('converts -ão to -ões', () => {
		expect(pluralize(2, 'avião')).toBe('aviões');
	});

	test('converts some irregulars properly', () => {
		expect(pluralize(2, 'pão')).toBe('pães');
		expect(pluralize(2, 'alemão')).toBe('alemães');
	});

	test('convert custom irregulars properly', () => {
		expect(pluralize(2, 'cônsul')).not.toBe('cônsules');
		expect(pluralize(2, 'cônsul', undefined, { cônsul: 'cônsules'})).toBe('cônsules');
		expect(pluralize(2, 'maçã', undefined, { maçã: 'maçãs'})).toBe('maçãs');
	});

	test('converts -m to -ns', () => {
		expect(pluralize(2, 'homem')).toBe('homens');
	});

	test('adds "es" for words ending in r or z', () => {
		expect(pluralize(2, 'luz')).toBe('luzes');
		expect(pluralize(2, 'motor')).toBe('motores');
	});

	test('converts-ol to -óis', () => {
		expect(pluralize(2, 'sol')).toBe('sóis');
	});

	test('converts -al, -ul to -ais, -uis', () => {
		expect(pluralize(2, 'animal')).toBe('animais');
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
		expect(pluralize('carro', '')).toBe('carros');
	});
});

describe('pluralizeWithCount()', () => {
	test('includes the count in the result', () => {
		expect(pluralizeWithCount(1, 'carro')).toBe('1 carro');
		expect(pluralizeWithCount(2, 'carro')).toBe('2 carros');
	});

	test('works with custom plural', () => {
		expect(pluralizeWithCount(2, 'livro', 'livrozinhos')).toBe('2 livrozinhos');
	});
});

describe('pluralizeWords()', () => {
	test('works with one word', () => {
		expect(pluralizeWords(0, ['papel'])).toBe('papel');
		expect(pluralizeWords(1, ['papel'])).toBe('papel');
		expect(pluralizeWords(2, ['papel'])).toBe('papéis');
	});

	test('works with two words', () => {
		expect(pluralizeWords(0, ['avião', 'antigo'])).toBe('avião antigo');
		expect(pluralizeWords(1, ['avião', 'antigo'])).toBe('avião antigo');
		expect(pluralizeWords(2, ['avião', 'antigo'])).toBe('aviões antigos');
	});

	test('works with three words', () => {
		expect(pluralizeWords(0, ['moto', 'branca', 'escolhida'])).toBe('moto branca escolhida');
		expect(pluralizeWords(1, ['moto', 'branca', 'escolhida'])).toBe('moto branca escolhida');
		expect(pluralizeWords(2, ['moto', 'branca', 'escolhida'])).toBe('motos brancas escolhidas');
	});

	test('works with custom plurals', () => {
		expect(pluralizeWords(2, ['o', 'avião', 'velho'], ['os', 'aviõezinhos', 'velhos'])).toBe('os aviõezinhos velhos');
	});
});
