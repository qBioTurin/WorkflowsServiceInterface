
import '@mantine/core/styles.css'; // Questo import dovrebbe gestire gli stili globali e la normalizzazione
import MyAppShell from '@/components/AppShell/MyAppShell';
import Footer from '../../components/footer/Footer'

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <>
      <MyAppShell children={children}/>
      <Footer/>
    </>
  );
}
