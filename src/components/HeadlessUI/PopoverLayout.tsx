import { Popover, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

interface PopoverLayoutProps {
  toggler: ReactNode;
  children: ReactNode;
  placement?: string;
  togglerClass?: string;
  menuClass?: string;
}

const placementClass: Record<string, string> = {
  'bottom-end':   'top-full right-0',
  'bottom-start': 'top-full left-0',
  'bottom':       'top-full left-1/2 -translate-x-1/2',
  'top-end':      'bottom-full right-0',
  'top-start':    'bottom-full left-0',
  'top':          'bottom-full left-1/2 -translate-x-1/2',
};

const PopoverLayout = ({ toggler, children, placement, togglerClass, menuClass }: PopoverLayoutProps) => {
  const posClass = placementClass[placement ?? 'bottom-start'] ?? 'top-full left-0';
  return (
    <Popover className="relative">
      <Popover.Button className={togglerClass ?? ''}>
        {toggler}
      </Popover.Button>
      <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
        <Popover.Panel className={`absolute ${posClass} z-50 ${menuClass ?? ''}`}>
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default PopoverLayout;
