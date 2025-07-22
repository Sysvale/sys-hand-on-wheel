export function pluralize(
	count: number | string | null,
	word: string,
	suffix: string = ''
): string {
	let plural = word;

	if (typeof count === 'string') {
		word = count;
		count = null;
	}

	const absCount = Math.abs(count ?? 2);
	console.log('test TS');

	if (absCount >= 2) {
		if (suffix) { // sufixo personalizado fornecido por quem chama a função
			plural = word + suffix;
		} else if (word.endsWith('s') || word.endsWith('x')) { // Palavras invariáveis terminadas em s ou x
			plural = word;
		} else if (word.endsWith('ão')) { // Exceções do -ão (padrão geral: -ões)
			plural = word.slice(0, -2) + 'ões';
		} else if (word.endsWith('m')) { // -m -> -ns
			plural = word.slice(0, -1) + 'ns';
		} else if (word.endsWith('r') || word.endsWith('z')) { // -r, -z -> +es
			plural = word + 'es';
		} else if (/[aou]l$/.test(word)) { // -al, -ol, -ul → -ais, -ois, -uis
			plural = word.slice(0, -1) + 'is';
		} else if (word.endsWith('el')) { // -el → -éis
			plural = word.slice(0, -2) + 'éis';
		} else if (word.endsWith('il')) { // -il → -is (oxítonas) [simplificado]
			plural = word.slice(0, -2) + 'is';
		} else if (/[aeiou]$/.test(word)) { // Regra geral para vogais finais
			plural = word + 's';
		}
	}

	return plural;
}

export function pluralizeWithCount(...args: Parameters<typeof pluralize>): string {
	const [counter] = args;
	return `${counter} ${pluralize(...args)}`;
}
