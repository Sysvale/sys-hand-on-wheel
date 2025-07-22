const irregulars: Record<string, string> = {
	pão: 'pães',
	mão: 'mãos',
	irmão: 'irmãos',
	capitão: 'capitães',
	cidadão: 'cidadãos',
	cão: 'cães',
	alemão: 'alemães',
	mal: 'males',
	órgão: 'órgãos',
	nível: 'níveis'
};

export function pluralize(
	count: number | string | null = null,
	word: string,
	customPlural: string = '',
	customIrregulars: Record<string, string> = {}
): string {

	let innerIrregulars = {
		...irregulars,
		...customIrregulars
	}

	if (typeof count === 'string') {
		word = count;
		count = null;
	}

	const absCount = Math.abs(count ?? 2);

	// Quantidades insuficientes para aplicação do plural
	if (absCount < 2) return word;

	// Sufixo personalizado fornecido por quem chama a função
	if (customPlural) return customPlural;

	// Cenário em que a palavra tem plural irregular
	if (innerIrregulars[word]) return innerIrregulars[word];

	// Palavras invariáveis terminadas em s ou x
	if (word.endsWith('s') || word.endsWith('x')) return word;

	// Exceções do -ão (padrão geral: -ões)
	if (word.endsWith('ão')) return word.slice(0, -2) + 'ões';

	// -m -> -ns
	if (word.endsWith('m')) return word.slice(0, -1) + 'ns';

	// -r, -z -> +es
	if (word.endsWith('r') || word.endsWith('z')) return word + 'es';

	// -ol → -óis
	if (word.endsWith('ol'))  return word.slice(0, -2) + 'óis';

	// -al, -ul → -ais, -uis
	if (/[au]l$/.test(word))  return word.slice(0, -1) + 'is';

	// -el → -éis
	if (word.endsWith('el')) return word.slice(0, -2) + 'éis';

	// -il → -is (oxítonas) [simplificado]
	if (word.endsWith('il')) return word.slice(0, -2) + 'is';

	// Regra geral para vogais finais
	if (/[aeiou]$/.test(word)) return word + 's';

	//Fallback
	return word;
}

export function pluralizeWithCount(...args: Parameters<typeof pluralize>): string {
	const [count] = args;
	return `${count} ${pluralize(...args)}`;
}

export function pluralizeWords(
	count: number | string | null,
	words: string[],
	customPlural: string[] | string = '',
	customIrregulars: Record<string, string> = {}
): string {
	let pluralizedWords = words.map((word, index) => pluralize(count, word, customPlural[index] ?? customPlural, customIrregulars));

	return `${pluralizedWords.join(' ')}`;
}
