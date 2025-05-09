// Componente para mostrar un logo con mejor manejo de errores y optimización
interface LogoProps {
    src: string;
    alt: string;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ src, alt, className }) => {
    // Usamos onError para mostrar un texto alternativo si la imagen falla en cargar
    return (
        <img
            className={className}
            src={src}
            alt={alt}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                console.warn(`Error al cargar la imagen: ${alt}`);
            }}
            loading="lazy" // Mejora de rendimiento con carga diferida
        />
    );
};