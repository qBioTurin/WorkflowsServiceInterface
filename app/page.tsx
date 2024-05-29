import { ArticlesCardsGrid } from '../components/Applicazioni/ArticlesCardsGrid';
import MyAppShell from '@/components/AppShell/MyAppShell';
import Footer from '@/components/footer/Footer';
import TestError from '@/components/TestError/TestError';
import TestDatabase from '@/components/TestDatabase/TestDatabase';

export default function HomePage() {
  
  const children = 
    <div>
      <ArticlesCardsGrid/>
    </div>;

  return (
    <>
      <MyAppShell children={children}/>
      
      <Footer/>
    </>
  );
}
