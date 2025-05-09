// utils/dateUtils.js

type DateFormat =
  | 'dayOfWeek, day month year'
  | 'day/month/year'
  | 'month day, year'
  | 'year-month-day';


/**
 * Objeto con los días de la semana en español
 */
export const DAYS_OF_WEEK = [
    "Domingo", // El índice 0 corresponde a domingo en JavaScript
    "Lunes",
    "Martes",
    "Miércoles", // Corregido el acento
    "Jueves",
    "Viernes",
    "Sábado"  // Corregido el acento
];

/**
 * Objeto con los meses del año en español
 */
export const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

/**
 * Formatea una fecha según el formato especificado
 * @param {Date} date - Objeto Date a formatear
 * @param {string} format - Formato deseado ('dayOfWeek, day month year' por defecto)
 * @returns {string} Fecha formateada según el formato especificado
 */
export const formatDate = (date: Date, format: DateFormat = 'dayOfWeek, day month year') => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Fecha inválida proporcionada a formatDate:', date);
        return 'Fecha inválida';
    }

    const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    // Formatos predefinidos
    const formats: Record<DateFormat, string> = {
        'dayOfWeek, day month year': `${dayOfWeek}, ${dayOfMonth} de ${month} ${year}`,
        'day/month/year': `${dayOfMonth}/${date.getMonth() + 1}/${year}`,
        'month day, year': `${month} ${dayOfMonth}, ${year}`,
        'year-month-day': `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`
    };

    return String(formats[format] || formats['dayOfWeek, day month year']);
};

/**
 * Obtiene la diferencia en días entre dos fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {number} Diferencia en días
 */
export const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // Horas * minutos * segundos * milisegundos
    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
};

/**
 * Verifica si una fecha es hoy
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} True si la fecha es hoy, false en caso contrario
 */
export const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};