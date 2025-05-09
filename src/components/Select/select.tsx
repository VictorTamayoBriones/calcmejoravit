import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './select.css';

// Interfaces
export interface SelectOption {
    value: string | number;
    label: string | ReactNode;
    disabled?: boolean;
}

export interface SelectProps {
    options: SelectOption[];
    value?: string | number | null;
    defaultValue?: string | number;
    onChange?: (value: string | number | null) => void;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    searchable?: boolean;
    loading?: boolean;
    error?: string;
    label?: string;
    required?: boolean;
    className?: string;
    dropdownClassName?: string;
    optionClassName?: string;
    customOptionRenderer?: (option: SelectOption) => ReactNode;
    customValueRenderer?: (option: SelectOption | null) => ReactNode;
    noOptionsMessage?: string;
    loadingMessage?: string;
    id?: string;
    name?: string;
    autoFocus?: boolean;
    tabIndex?: number;
    direction?: 'down' | 'up';
    size?: 'small' | 'medium' | 'large';
    dataTestId?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

/**
 * Select - A reusable, customizable select component for React applications
 */
const Select: React.FC<SelectProps> = ({
    options,
    value = null,
    defaultValue,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    clearable = false,
    searchable = false,
    loading = false,
    error,
    label,
    required = false,
    className = '',
    dropdownClassName = '',
    optionClassName = '',
    customOptionRenderer,
    customValueRenderer,
    noOptionsMessage = 'No options available',
    loadingMessage = 'Loading...',
    id,
    //name,
    autoFocus = false,
    tabIndex,
    direction = 'down',
    size = 'medium',
    dataTestId,
    onFocus,
    onBlur,
}) => {
    // State management
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | number | null>(
        defaultValue !== undefined ? defaultValue : value
    );
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    // Refs
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find the selected option
    const selectedOption = options.find(option => option.value === selectedValue) || null;

    // Filter options based on search term
    const filteredOptions = searchTerm
        ? options.filter(option =>
            String(option.label)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        : options;

    // Effect to handle outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSearchTerm('');
                if (onBlur) onBlur();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onBlur]);

    // Effect to focus input when searchable dropdown opens
    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Effect to focus on autofocus
    useEffect(() => {
        if (autoFocus && selectRef.current) {
            selectRef.current.focus();
        }
    }, [autoFocus]);

    // Effect to update component when external value changes
    useEffect(() => {
        if (value !== undefined && value !== selectedValue) {
            setSelectedValue(value);
        }
    }, [value]);

    // Effect to position dropdown
    useEffect(() => {
        if (isOpen && dropdownRef.current && selectRef.current) {
            const selectRect = selectRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight;
            const windowHeight = window.innerHeight;

            // Check if there's enough space below
            const spaceBelow = windowHeight - selectRect.bottom;
            const shouldDisplayAbove = direction === 'up' || (direction === 'down' && spaceBelow < dropdownHeight && selectRect.top > dropdownHeight);

            if (shouldDisplayAbove) {
                dropdownRef.current.style.bottom = `${selectRect.height}px`;
                dropdownRef.current.style.top = 'auto';
            } else {
                dropdownRef.current.style.top = `${selectRect.height}px`;
                dropdownRef.current.style.bottom = 'auto';
            }
        }
    }, [isOpen, direction]);

    // Handlers
    const handleToggleDropdown = () => {
        if (!disabled) {
            const newIsOpen = !isOpen;
            setIsOpen(newIsOpen);

            if (newIsOpen) {
                if (onFocus) onFocus();
                // Find and highlight the current value
                if (selectedValue !== null) {
                    const index = filteredOptions.findIndex(option => option.value === selectedValue);
                    setHighlightedIndex(index);
                }
            } else {
                setSearchTerm('');
                if (onBlur) onBlur();
            }
        }
    };

    const handleOptionClick = (option: SelectOption) => {
        if (option.disabled) return;

        const newValue = option.value;
        setSelectedValue(newValue);
        setIsOpen(false);
        setSearchTerm('');
        if (onChange) {
            console.log("new value: ", newValue);
            onChange(newValue);
        }

        if (onBlur) onBlur();
    };

    const handleClearClick = (event: React.MouseEvent) => {
        event.stopPropagation();

        setSelectedValue(null);
        setSearchTerm('');

        if (onChange) {
            onChange(null);
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setHighlightedIndex(0); // Reset highlight to first option when searching
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        switch (event.key) {
            case 'Enter':
                if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    handleOptionClick(filteredOptions[highlightedIndex]);
                } else {
                    handleToggleDropdown();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchTerm('');
                if (onBlur) onBlur();
                break;
            case 'ArrowDown':
                if (isOpen) {
                    event.preventDefault();
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                } else {
                    handleToggleDropdown();
                }
                break;
            case 'ArrowUp':
                if (isOpen) {
                    event.preventDefault();
                    setHighlightedIndex(prev =>
                        prev > 0 ? prev - 1 : filteredOptions.length - 1
                    );
                } else {
                    handleToggleDropdown();
                }
                break;
            case ' ': // Space
                if (!searchable) {
                    event.preventDefault();
                    handleToggleDropdown();
                }
                break;
            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    setSearchTerm('');
                    if (onBlur) onBlur();
                }
                break;
        }
    };

    // Render functions
    const renderValue = () => {
        if (customValueRenderer && selectedOption) {
            return customValueRenderer(selectedOption);
        }

        if (selectedOption) {
            return <span className="custom-select__value">{selectedOption.label}</span>;
        }

        return <span className="custom-select__placeholder">{placeholder}</span>;
    };

    const renderOption = (option: SelectOption, index: number) => {
        const isHighlighted = index === highlightedIndex;
        const isSelected = option.value === selectedValue;

        const optionClasses = [
            'custom-select__option',
            optionClassName,
            isHighlighted ? 'custom-select__option--highlighted' : '',
            isSelected ? 'custom-select__option--selected' : '',
            option.disabled ? 'custom-select__option--disabled' : '',
        ].filter(Boolean).join(' ');

        const handleMouseEnter = () => {
            if (!option.disabled) {
                setHighlightedIndex(index);
            }
        };

        return (
            <div
                key={option.value}
                className={optionClasses}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={handleMouseEnter}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
            >
                {customOptionRenderer ? customOptionRenderer(option) : option.label}
            </div>
        );
    };

    // Compute classes
    const selectClasses = [
        'custom-select',
        `custom-select--${size}`,
        className,
        disabled ? 'custom-select--disabled' : '',
        isOpen ? 'custom-select--open' : '',
        error ? 'custom-select--error' : '',
    ].filter(Boolean).join(' ');

    const dropdownClasses = [
        'custom-select__dropdown',
        dropdownClassName,
        direction === 'up' ? 'custom-select__dropdown--up' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className="custom-select-container">
            {label && (
                <label className="custom-select__label" htmlFor={id}>
                    {label}
                    {required && <span className="custom-select__required-mark">*</span>}
                </label>
            )}

            <div
                ref={selectRef}
                className={selectClasses}
                onClick={handleToggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : tabIndex || 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${id || 'custom-select'}-listbox`}
                aria-labelledby={label ? `${id || 'custom-select'}-label` : undefined}
                aria-disabled={disabled}
                aria-invalid={!!error}
                data-testid={dataTestId}
                id={id}
            >
                <div className="custom-select__control">
                    {renderValue()}

                    <div className="custom-select__indicators">
                        {clearable && selectedValue !== null && !disabled && (
                            <div
                                className="custom-select__clear-indicator"
                                onClick={handleClearClick}
                                aria-label="Clear selection"
                            >
                                ×
                            </div>
                        )}

                        <div className={`custom-select__dropdown-indicator ${isOpen ? 'custom-select__dropdown-indicator--open' : ''}`}>
                            ▼
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className={dropdownClasses}
                        role="listbox"
                        id={`${id || 'custom-select'}-listbox`}
                    >
                        {searchable && (
                            <div className="custom-select__search">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="custom-select__search-input"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Search..."
                                    aria-label="Search options"
                                />
                            </div>
                        )}

                        <div className="custom-select__options">
                            {loading ? (
                                <div className="custom-select__loading">{loadingMessage}</div>
                            ) : filteredOptions.length === 0 ? (
                                <div className="custom-select__no-options">{noOptionsMessage}</div>
                            ) : (
                                filteredOptions.map(renderOption)
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="custom-select__error-message">{error}</div>}
        </div>
    );
};

export default Select;