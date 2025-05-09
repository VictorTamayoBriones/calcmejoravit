import { formatDate } from "@utils/dateUtils";
import { useMemo } from "react";

interface PROPS{
    format: 
    'dayOfWeek, day month year'
    | 'day/month/year'
    | 'month day, year'
    | 'year-month-day'
}

// Componente para mostrar la fecha actual
export const DateDisplay = ({ format }:PROPS) => {
    // Uso de useMemo para evitar recalcular la fecha en cada renderizado
    const formattedDate = useMemo(() => formatDate(new Date(), format), [format]);

    return (
        <div className="date_data">
            <strong>Fecha:</strong>
            <strong>{formattedDate}</strong>
        </div>
    );
};