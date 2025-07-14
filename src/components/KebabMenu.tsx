'use client';
import { useState, useRef, useEffect } from 'react';
import KebabMenuIcon from '@icons/KebabMenuIcon';

export interface Menu {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface KebabMenuProps {
  menus: Menu[];
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

/**
 * 케밥 메뉴 컴포넌트
 */
const KebabMenu = ({
  menus,
  open: openProp,
  setOpen: setOpenProp,
}: KebabMenuProps) => {
  const [internalOpen, internalSetOpen] = useState<boolean>(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = setOpenProp !== undefined ? setOpenProp : internalSetOpen;
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [dropUp, setDropUp] = useState(false);

  const handleMenuButtonClick = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 100); // 100px보다 공간이 부족하면 위로
    }
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={menuButtonRef}
        type="button"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-transparent hover:bg-gray-100 focus:outline-none"
        onClick={handleMenuButtonClick}
        aria-label="메뉴 열기"
        aria-expanded={open}
      >
        <KebabMenuIcon className="h-6 w-6" />
      </button>
      {open && (
        <div
          className={
            dropUp
              ? 'absolute right-0 bottom-full z-50 mb-2 flex w-30 flex-col rounded border border-[var(--color-border)] bg-white text-sm font-medium shadow-lg'
              : 'absolute right-0 z-50 mt-2 flex w-30 flex-col rounded border border-[var(--color-border)] bg-white text-sm font-medium shadow-lg'
          }
        >
          {menus.map((menu) => (
            <button
              key={menu.value}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                menu.onClick?.();
                setOpen(false);
              }}
            >
              {menu.icon ? menu.icon : <></>}
              {menu.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
