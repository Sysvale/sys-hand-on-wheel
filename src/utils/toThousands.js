export default function (value) {
	const hasDecimals = +value % 1 !== 0;

	const formatter = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: hasDecimals ? 2 : 0
    });

    return formatter.format(+value);
}
