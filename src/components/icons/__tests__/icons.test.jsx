/**
 * @fileoverview Tests for shared SVG icons library.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  IconMic,
  IconClose,
  IconSend,
  IconVolumeUp,
  IconVolumeOff,
  IconBrain,
  IconShield,
  IconHistory,
  IconScale,
  IconUsers,
  IconSettings,
  IconMenu,
  IconArrowLeft,
  IconCheckCircle,
  IconXCircle,
  IconChevronRight,
} from '../index';

describe('Shared SVG Icons', () => {
  const icons = [
    { name: 'IconMic', Component: IconMic },
    { name: 'IconClose', Component: IconClose },
    { name: 'IconSend', Component: IconSend },
    { name: 'IconVolumeUp', Component: IconVolumeUp },
    { name: 'IconVolumeOff', Component: IconVolumeOff },
    { name: 'IconBrain', Component: IconBrain },
    { name: 'IconShield', Component: IconShield },
    { name: 'IconHistory', Component: IconHistory },
    { name: 'IconScale', Component: IconScale },
    { name: 'IconUsers', Component: IconUsers },
    { name: 'IconSettings', Component: IconSettings },
    { name: 'IconMenu', Component: IconMenu },
    { name: 'IconArrowLeft', Component: IconArrowLeft },
    { name: 'IconCheckCircle', Component: IconCheckCircle },
    { name: 'IconXCircle', Component: IconXCircle },
    { name: 'IconChevronRight', Component: IconChevronRight },
  ];

  icons.forEach(({ name, Component }) => {
    it(`renders ${name} without crashing`, () => {
      const { container } = render(<Component className="test-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Ensure aria-hidden is present by default for decorative icons
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveClass('test-class');
    });
  });
});
