const validaCartaoSus = function (vlrCNS) {
	if (typeof vlrCNS !== 'string') {
		vlrCNS = vlrCNS.toString();
	}

	if (!vlrCNS || !vlrCNS.length) {
		return true;
	}

	vlrCNS = vlrCNS.replace(/\D/g, '');
	if (vlrCNS.length != 15) {
		return false;
	}
	if ([1, 2].indexOf(parseInt(vlrCNS.substring(0, 1))) != -1) {
		return validaCNS(vlrCNS);
	}
	return ValidaCNS_PROV(vlrCNS);
};

function ValidaCNS_PROV(vlrCNS) {
	let pis;
	let resto;
	let dv;
	let soma;
	let resultado;
	const result = 0;

	pis = vlrCNS.substring(0, 15);

	if (pis === '') {
		return false;
	}

	if ((vlrCNS.substring(0, 1) != '7') && (vlrCNS.substring(0, 1) != '8') && (vlrCNS.substring(0, 1) != '9')) {
		return false;
	}

	soma = ((parseInt(pis.substring(0, 1), 10)) * 15)
		+ ((parseInt(pis.substring(1, 2), 10)) * 14)
		+ ((parseInt(pis.substring(2, 3), 10)) * 13)
		+ ((parseInt(pis.substring(3, 4), 10)) * 12)
		+ ((parseInt(pis.substring(4, 5), 10)) * 11)
		+ ((parseInt(pis.substring(5, 6), 10)) * 10)
		+ ((parseInt(pis.substring(6, 7), 10)) * 9)
		+ ((parseInt(pis.substring(7, 8), 10)) * 8)
		+ ((parseInt(pis.substring(8, 9), 10)) * 7)
		+ ((parseInt(pis.substring(9, 10), 10)) * 6)
		+ ((parseInt(pis.substring(10, 11), 10)) * 5)
		+ ((parseInt(pis.substring(11, 12), 10)) * 4)
		+ ((parseInt(pis.substring(12, 13), 10)) * 3)
		+ ((parseInt(pis.substring(13, 14), 10)) * 2)
		+ ((parseInt(pis.substring(14, 15), 10)) * 1);

	resto = soma % 11;

	if (!resto) {
		return true;
	}

	return false;
}
function validaCNS(vlrCNS) {
	let soma = 0;
	let resto = 0;
	let dv = 0;
	let pis = '';
	let resultado = '';
	const tamCNS = vlrCNS.length;
	if ((tamCNS) != 15) {
		return false;
	}
	pis = vlrCNS.substring(0, 11);
	soma = (((Number(pis.substring(0, 1))) * 15)
		+ ((Number(pis.substring(1, 2))) * 14)
		+ ((Number(pis.substring(2, 3))) * 13)
		+ ((Number(pis.substring(3, 4))) * 12)
		+ ((Number(pis.substring(4, 5))) * 11)
		+ ((Number(pis.substring(5, 6))) * 10)
		+ ((Number(pis.substring(6, 7))) * 9)
		+ ((Number(pis.substring(7, 8))) * 8)
		+ ((Number(pis.substring(8, 9))) * 7)
		+ ((Number(pis.substring(9, 10))) * 6)
		+ ((Number(pis.substring(10, 11))) * 5));
	resto = soma % 11;
	dv = 11 - resto;
	if (dv == 11) {
		dv = 0;
	}
	if (dv == 10) {
		soma = (((Number(pis.substring(0, 1))) * 15)
			+ ((Number(pis.substring(1, 2))) * 14)
			+ ((Number(pis.substring(2, 3))) * 13)
			+ ((Number(pis.substring(3, 4))) * 12)
			+ ((Number(pis.substring(4, 5))) * 11)
			+ ((Number(pis.substring(5, 6))) * 10)
			+ ((Number(pis.substring(6, 7))) * 9)
			+ ((Number(pis.substring(7, 8))) * 8)
			+ ((Number(pis.substring(8, 9))) * 7)
			+ ((Number(pis.substring(9, 10))) * 6)
			+ ((Number(pis.substring(10, 11))) * 5) + 2);
		resto = soma % 11;
		dv = 11 - resto;
		resultado = `${pis}001${String(dv)}`;
	} else {
		resultado = `${pis}000${String(dv)}`;
	}
	if (vlrCNS != resultado) {
		return false;
	}
	return true;
}

export default validaCartaoSus;
