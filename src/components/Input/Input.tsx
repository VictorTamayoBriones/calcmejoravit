import React, { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

import './Input.css';

// Definición de los tipos de temas disponibles
export type InputTheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Definición de los tipos de tamaños
export type InputSize = 'small' | 'medium' | 'large';

// Definición de los tipos de input shape
export type InputShape = 'sharp' | 'rounded' | 'pill';

// Interfaz para extender las propiedades nativas del input HTML y añadir nuestras propias props
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    // Propiedades de apariencia
    label?: string;
    theme?: InputTheme;
    size?: InputSize;
    shape?: InputShape;
    fullWidth?: boolean;

    // Propiedades de estado
    isLoading?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;

    // Propiedades de feedback visual
    error?: string;
    hint?: string;

    // Propiedades de iconos
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Propiedades de comportamiento
    clearable?: boolean;
    onClear?: () => void;

    // Propiedades de eventos
    onValueChange?: (value: string) => void;

    // Propiedades de integración para formularios
    validateOnChange?: boolean;
    validate?: (value: string) => string | null;
}

// Componente de input utilizando forwardRef para permitir pasar la referencia desde componentes padre
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            // Desestructuración con valores por defecto
            label,
            theme = 'default',
            size = 'medium',
            shape = 'rounded',
            fullWidth = false,
            isLoading = false,
            isDisabled = false,
            isReadOnly = false,
            isRequired = false,
            error,
            hint,
            leftIcon,
            rightIcon,
            clearable = false,
            onClear,
            onValueChange,
            validateOnChange = false,
            validate,
            className = '',
            onChange,
            value,
            placeholder,
            type = 'text',
            ...restProps
        },
        ref
    ) => {
        // Generamos un ID único para asociar el label con el input
        const inputId = useId();

        // Estado interno para controlar el value cuando no se proporciona desde fuera
        const [innerValue, setInnerValue] = useState<string>(value as string || '');
        const [innerError, setInnerError] = useState<string | null>(error || null);

        // Determinamos si el componente es controlado o no
        const isControlled = value !== undefined;
        const currentValue = isControlled ? value : innerValue;

        // Función para manejar cambios en el input
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            // Si no es controlado, actualizamos el estado interno
            if (!isControlled) {
                setInnerValue(newValue);
            }

            // Ejecutamos la validación si está configurada
            if (validateOnChange && validate) {
                const validationError = validate(newValue);
                setInnerError(validationError);
            }

            // Propagamos el evento original
            onChange?.(e);

            // Notificamos el cambio de valor si se proporcionó la función
            onValueChange?.(newValue);
        };

        // Función para limpiar el input
        const handleClear = () => {
            if (!isControlled) {
                setInnerValue('');
            }

            // Notificamos la limpieza si se proporcionó la función
            onClear?.();

            // Emulamos un evento de cambio para mantener la consistencia
            onValueChange?.('');
        };

        // Clases CSS basadas en las propiedades
        const inputClasses = [
            'custom-input',
            `custom-input--theme-${theme}`,
            `custom-input--size-${size}`,
            `custom-input--shape-${shape}`,
            fullWidth && 'custom-input--full-width',
            isDisabled && 'custom-input--disabled',
            isReadOnly && 'custom-input--readonly',
            (innerError || error) && 'custom-input--error',
            leftIcon && 'custom-input--with-left-icon',
            rightIcon && 'custom-input--with-right-icon',
            className
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={`custom-input-container ${fullWidth ? 'custom-input-container--full-width' : ''}`}>
                {/* Label del input */}
                {label && (
                    <label htmlFor={inputId} className="custom-input-label">
                        {label}
                        {isRequired && <span className="custom-input-required">*</span>}
                    </label>
                )}

                {/* Contenedor del input con iconos y acciones */}
                <div className="custom-input-wrapper">
                    {/* Icono izquierdo */}
                    {leftIcon && <div className="custom-input-icon custom-input-icon--left">{leftIcon}</div>}

                    {/* Input principal */}
                    <input
                        id={inputId}
                        ref={ref}
                        type={type}
                        className={inputClasses}
                        value={currentValue}
                        onChange={handleChange}
                        disabled={isDisabled || isLoading}
                        readOnly={isReadOnly}
                        required={isRequired}
                        placeholder={placeholder}
                        {...restProps}
                    />

                    {/* Icono de carga */}
                    {isLoading && (
                        <div className="custom-input-icon custom-input-icon--right">
                            <div className="custom-input-spinner"></div>
                        </div>
                    )}

                    {/* Botón para limpiar el input */}
                    {clearable && !isDisabled && !isReadOnly && currentValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="custom-input-clear-button"
                            aria-label="Limpiar campo"
                        >
                            ×
                        </button>
                    )}

                    {/* Icono derecho */}
                    {rightIcon && !isLoading && <div className="custom-input-icon custom-input-icon--right">{rightIcon}</div>}
                </div>

                {/* Mensajes de error o ayuda */}
                <div className="custom-input-messages">
                    {(innerError || error) && <p className="custom-input-error-message">{innerError || error}</p>}
                    {hint && !error && !innerError && <p className="custom-input-hint">{hint}</p>}
                </div>
            </div>
        );
    }
);

// Nombre para DevTools
Input.displayName = 'Input';

export default Input;