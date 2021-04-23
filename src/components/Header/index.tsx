import styles from './styles.module.scss';
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link';

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/assets/images/logo.svg" alt="RapaduraCasters"/>
      </Link>
      <p>Rapadura é doce, mas não é mole</p>

      <span>{currentDate}</span>
    </header>

  )
}