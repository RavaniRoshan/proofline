import { FaArrowRight } from 'react-icons/fa6';
import { Footer7 } from '.';
import LogoIcon from '@/assets/logo-icon';

export default function Footer7Demo() {
  const linkGroups = [
    {
      title: 'COMPANY',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Architecture', href: '/about#pipeline' },
        { label: 'Fact Register', href: '/facts' },
        { label: 'Decision Journal', href: '/audit' },
      ],
    },
    {
      title: 'SOLUTIONS',
      links: [
        { label: 'Preflight Checker', href: '/check' },
        { label: 'Telemetry Dashboard', href: '/dashboard' },
        { label: 'REST API', href: '/api/verify' },
        { label: 'Deterministic Rules', href: '/about' },
      ],
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'GitHub Repository', href: 'https://github.com/RavaniRoshan/proofline' },
        { label: 'Architecture RFC', href: '/about' },
        { label: '24 Smoke Evals', href: 'https://github.com/RavaniRoshan/proofline' },
        { label: 'Audit Ledger', href: '/audit' },
      ],
    },
  ];

  return (
    <div className="bg-background flex w-full items-center justify-center">
      <Footer7
        logo={<LogoIcon className="size-8" />}
        brandName="Watermelon"
        badgeText="Loved by Creators"
        headline="Fresh insights, tutorials, and updates delivered to your inbox."
        inputPlaceholder="Enter your email"
        buttonText="Stay Updated"
        buttonIcon={<FaArrowRight />}
        backgroundImage="https://assets.watermelon.sh/footer-7-bg.avif"
        linkGroups={linkGroups}
        brandWatermark="Watermelon."
      />
    </div>
  );
}
