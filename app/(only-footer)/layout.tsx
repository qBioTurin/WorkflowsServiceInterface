import '@mantine/core/styles.css';
import DoubleHeader from '@/components/header/DoubleHeader';
import Footer from '@/components/footer/Footer';

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'rgb(236, 233, 234)', // Colore di sfondo del layout generale
      }}
    >
      <main style={{ flexGrow: 1 }}>{children}</main> {/* Fai crescere il main */}
      <Footer />
    </div>
  );
}
