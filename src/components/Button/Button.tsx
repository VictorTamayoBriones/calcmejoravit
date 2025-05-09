import './button.css';

/**
 * Componente de botón altamente personalizable para React
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.variant='primary'] - Variante del botón ('primary', 'secondary', 'success', 'danger', 'warning', 'info')
 * @param {string} [props.size='medium'] - Tamaño del botón ('small', 'medium', 'large')
 * @param {boolean} [props.rounded=false] - Si el botón tiene bordes redondeados
 * @param {boolean} [props.outlined=false] - Si el botón es tipo outlined (solo borde)
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado
 * @param {boolean} [props.fullWidth=false] - Si el botón ocupa todo el ancho disponible
 * @param {string} [props.iconLeft] - Nombre de clase para icono a la izquierda (ej: 'fas fa-plus')
 * @param {string} [props.iconRight] - Nombre de clase para icono a la derecha
 * @param {Function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Object} [props.style] - Estilos inline adicionales
 * @param {string} [props.type='button'] - Tipo del botón ('button', 'submit', 'reset')
 * @param {string} [props.ariaLabel] - Etiqueta aria para accesibilidad
 * @returns {React.ReactElement} Componente de botón personalizado
 */

interface PROPS{
    variant?:string
    size?:string
    rounded?:boolean
    outlined?:boolean
    disabled?:boolean
    fullWidth?:boolean
    iconLeft?:string
    iconRight?:string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?:string
    children?:React.ReactNode
    style?:object
    type?:"button" | "submit" | "reset" | undefined
    ariaLabel?:string
};

const Button = ({
    variant = 'primary',
    size = 'medium',
    rounded = false,
    outlined = false,
    disabled = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    onClick,
    className = '',
    children,
    style = {},
    type = 'button',
    ariaLabel,
    ...restProps
}: PROPS) => {
    // Construir las clases CSS basadas en las props
    const buttonClasses = [
        'custom-button',
        `custom-button--${variant}`,
        `custom-button--${size}`,
        rounded ? 'custom-button--rounded' : '',
        outlined ? 'custom-button--outlined' : '',
        fullWidth ? 'custom-button--full-width' : '',
        disabled ? 'custom-button--disabled' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            style={style}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            {...restProps}
        >
            {iconLeft && <span className={`custom-button__icon custom-button__icon--left ${iconLeft}`} />}
            <span className="custom-button__text">{children}</span>
            {iconRight && <span className={`custom-button__icon custom-button__icon--right ${iconRight}`} />}
        </button>
    );
};

export default Button;