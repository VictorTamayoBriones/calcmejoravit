export function numeroAPalabras(valor: number): string {
    const unidades = [
        "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
        "diez", "once", "doce", "trece", "catorce", "quince",
        "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte",
    ];
    const decenas = [
        "", "", "veinti", "treinta", "cuarenta", "cincuenta",
        "sesenta", "setenta", "ochenta", "noventa",
    ];
    const centenas = [
        "", "ciento", "doscientos", "trescientos", "cuatrocientos",
        "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos",
    ];

    function convertirGrupo(n: number): string {
        if (n === 100) return "cien";
        let texto = "";

        const c = Math.floor(n / 100);
        const d = Math.floor((n % 100) / 10);
        const u = n % 10;
        const resto = n % 100;

        if (c > 0) texto += centenas[c] + " ";

        if (resto <= 20) {
            texto += unidades[resto];
        } else {
            texto += decenas[d];
            if (d > 2 && u > 0) {
                texto += " y " + unidades[u];
            } else if (d === 2 && u > 0) {
                texto += unidades[u];
            }
        }

        return texto.trim();
    }

    function secciones(n: number): string {
        if (n === 0) return "cero";

        const millones = Math.floor(n / 1000000);
        const miles = Math.floor((n % 1000000) / 1000);
        const resto = n % 1000;

        let texto = "";

        if (millones > 0) {
            texto += (millones === 1 ? "un millón" : `${convertirGrupo(millones)} millones`);
        }

        if (miles > 0) {
            texto += (texto ? " " : "") + (miles === 1 ? "mil" : `${convertirGrupo(miles)} mil`);
        }

        if (resto > 0) {
            texto += (texto ? " " : "") + convertirGrupo(resto);
        }

        return texto.trim();
    }

    const entero = Math.floor(valor);
    const centavos = Math.round((valor - entero) * 100);

    const letras = secciones(entero);
    const centavosTexto = centavos.toString().padStart(2, "0");

    return `${letras} ${centavosTexto}/100 M.N.`;
}
