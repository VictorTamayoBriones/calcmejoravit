import type { IDataMejoravit } from "@/pages/CalcMejoravit/context/CalcMejoravitContext";

// Función reutilizable para descargar datos como archivo de texto
export const downloadFormDataAsTxt = (data: IDataMejoravit, filename: string = 'data.txt'): void => {
    // Convertir el objeto a formato legible
    const formattedData = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    // Crear un blob con el contenido
    const blob = new Blob([formattedData], { type: 'text/plain;charset=utf-8' });

    // Crear URL para el blob
    const url = URL.createObjectURL(blob);

    // Crear elemento <a> temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Simular clic para descargar
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};