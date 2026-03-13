import { AsyncPaginate } from 'react-select-async-paginate';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../plugin/api';

// Modificación de tu interfaz para soportar el renderizado de íconos
interface Props {
    value: any;
    onChange: (value: any) => void;
    label: string;
    endPoint: string;
    isMulti?: boolean;
    isDisabled?: boolean;
    // Añadimos esta prop para renderizar el ícono en la lista
    isIconSelect?: boolean;
}

export const Select2 = ({ value, onChange, label, endPoint, isMulti, isDisabled, isIconSelect }: Props) => {

    const loadOptions = async (search: string, { page }: any) => {
        // En 2026, asegúrate de que tu API devuelva { value: 'house', label: 'house' }
        const response = await api.get(`${endPoint}?search=${search}&page=${page}`);
        return {
            options: response.data.options,
            hasMore: response.data.hasMore,
            additional: { page: page + 1 },
        };
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">{label}</label>
            <AsyncPaginate
                isDisabled={isDisabled}
                isMulti={isMulti}
                additional={{ page: 1 }}
                value={value}
                loadOptions={loadOptions}
                onChange={onChange}
                debounceTimeout={500}
                // Esta es la clave para ver el ícono:
                formatOptionLabel={(option: any) => (
                    <div className="flex items-center gap-3">
                        {/* {isIconSelect && (
                            <FontAwesomeIcon
                                icon={[option.prefix, option.icon]}
                                style={{ color: '#00ABA8' }}
                                className="w-5 text-indigo-500"
                            />
                        )} */}
                        <span>{option.label}</span>
                    </div>
                )}
            />
        </div>
    );
};
