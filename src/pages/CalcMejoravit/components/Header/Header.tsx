import LOGO_GVVR from '@assets/logo_gvvr.png';
import LOGO_MEJORAVIT from '@assets/logo_mejoravit.png';
import { DateDisplay } from './components/DateDysplay';
import { Logo } from './components/Logo';
import './header.css';

export const Header = () => {


    return (
        <header>
            <Logo className='logo' src={LOGO_GVVR} alt="Grupo a vivir" />
            <Logo className='logo' src={LOGO_MEJORAVIT} alt="Mejoravit" />
            <DateDisplay format='dayOfWeek, day month year' />
        </header>
    )
}
