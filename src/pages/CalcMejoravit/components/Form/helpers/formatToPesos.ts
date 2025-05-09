/**
 * Formatea un número en string a formato de pesos con implementación manual
 * @param value - El valor numérico en formato string
 * @param decimales - Cantidad de decimales a mostrar (por defecto 2)
 * @param simbolo - Símbolo de moneda a utilizar (por defecto '$')
 * @returns String formateado con el símbolo de pesos y separadores de miles
 */
export const formatToPesos = (value: string,decimales: number = 2,simbolo: string = '$'): string => {
    // Validar que el input sea un número válido
    if (!value || isNaN(Number(value))) {
        return `${simbolo}0`;
    }

    // Convertir a número para el procesamiento
    const numero = Number(value);

    // Separar la parte entera de la decimal
    const partes = numero.toFixed(decimales).split('.');
    const parteEntera = partes[0];
    const parteDecimal = partes.length > 1 ? partes[1] : '';

    // Agregar comas como separadores de miles
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    const enteraFormateada = parteEntera.replace(regex, ',');

    // Construir el resultado final
    let resultado = `${simbolo}${enteraFormateada}`;

    // Agregar decimales si es necesario
    if (decimales > 0) {
        resultado += `.${parteDecimal}`;
    }

    return resultado;
};


export const formatAsNumber = (value: string | number) => {
    const PARSED = String(value).replace("$", '').replace(/,/g, '');
    return PARSED;
}

// Ejemplos de uso:
// formatToPesos('2500')              -> '$2,500.00'
// formatToPesos('1234567.89')        -> '$1,234,567.89'
// formatToPesos('1000', 0)           -> '$1,000'
// formatToPesos('5000', 2, 'MXN $')  -> 'MXN $5,000.00'