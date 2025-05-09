import Select from '@components/Select/select';
import { useCalcMejoravit } from '../../hooks/useCalcMejoravit';

export default function Commission() {

    const { updateDataMejoravit } = useCalcMejoravit();

    const OPTIONS = [{"value": "20","label": "20%"},{"value": "21","label": "21%"},{"value": "22","label": "22%"},{"value": "23","label": "23%"},{"value": "24","label": "24%"},{"value": "25","label": "25%"},{"value": "26","label": "26%"},{"value": "27","label": "27%"},{"value": "28","label": "28%"},{"value": "29","label": "29%"},{"value": "30","label": "30%"},{"value": "31","label": "31%"}];

    const myChange = (value: string | number | null) => updateDataMejoravit({"commision" : value});

    return (
        <Select options={OPTIONS} label="Comisión" name='commision' id='commision' onChange={myChange}/>
    )
}
