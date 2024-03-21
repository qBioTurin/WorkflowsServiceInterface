
import '@mantine/core/styles.css'; // Questo import dovrebbe gestire gli stili globali e la normalizzazione
import DoubleHeader from '../../components/header/DoubleHeader';
import Footer from '../../components/footer/Footer'

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer/>
    </>
  );
}
