// app/layout.tsx o pages/_app.tsx a seconda della tua struttura
import { MantineProvider } from '@mantine/core';
import { theme } from '../theme'; // Assicurati che il percorso al tuo file tema sia corretto
import '@mantine/core/styles.css'; // Questo import dovrebbe gestire gli stili globali e la normalizzazione
import DoubleHeader from '../components/header/DoubleHeader';
import Footer from '../components/footer/Footer'

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html>
        <body className='min-h-screen flex flex-col relative pb-20'>
          <MantineProvider theme={theme}>
            <main>{children}</main>
          </MantineProvider>
      </body>
    </html>
  );
}
