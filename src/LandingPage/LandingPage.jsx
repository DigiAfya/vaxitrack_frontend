import { Nav } from './Navigation/Nav';
import { Heading } from './Heading/Heading';
import { Section } from './SectionWhy/Section';
import { Solution } from './Solution/Solution';
import { Trust } from './Trust/Trust';
import { TakeControl } from './TakeControl/TakeControl';
import { Footer } from './Footer/Footer';

export function LandingPage() {
  return (
    <>
      <Nav />
      <Heading />
      <Section />
      <Solution />
      <Trust />
      <TakeControl />
      <Footer />
    </>
  );
}