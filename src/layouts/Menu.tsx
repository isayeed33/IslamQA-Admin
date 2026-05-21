import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { findAllParent, findMenuItem } from '../helpers/menu';
import { MenuItemTypes } from '../constants/menu';
import { SimpleCollapse } from '../components/FrostUI';

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: Array<string>;
  toggleMenu?: (item: any, status: boolean) => void;
  className?: string;
}

const MenuItemWithChildren = ({ item, linkClassName, subMenuClassNames, activeMenuItems, toggleMenu }: SubMenus) => {
  const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = () => {
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
  };

  return (
    <li className="menu-item">
      <Link to="#" className={`${linkClassName} ${activeMenuItems!.includes(item.key) && open ? 'open' : ''}`} aria-expanded={open} data-menu-key={item.key} onClick={toggleMenuItem}>
        {item.icon && <span className="menu-icon"><i className={item.icon} /></span>}
        <span className="menu-text">{item.label}</span>
        <span className="menu-arrow" />
      </Link>
      <SimpleCollapse open={open} as="ul" classNames={subMenuClassNames}>
        {(item.children || []).map((child, idx) => (
          <React.Fragment key={idx}>
            {child.children ? (
              <MenuItemWithChildren item={child} linkClassName={activeMenuItems!.includes(child.key) ? " active" : ""} activeMenuItems={activeMenuItems} subMenuClassNames="" toggleMenu={toggleMenu} />
            ) : (
              <MenuItem item={child} className="menu-item" linkClassName={`menu-link ${activeMenuItems!.includes(child.key) ? " active" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </SimpleCollapse>
    </li>
  );
};

const MenuItem = ({ item, linkClassName }: SubMenus) => (
  <li className="menu-item">
    <Link to={item.url!} target={item.target} className={`side-nav-link-ref ${linkClassName}`} data-menu-key={item.key}>
      {item.icon && <span className="menu-icon"><i className={item.icon} /></span>}
      <span className="menu-text">{item.label}</span>
    </Link>
  </li>
);

interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const location = useLocation();
  const menuRef = useRef(null);
  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

  const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
    if (show) setActiveMenuItems([menuItem['key'], ...findAllParent(menuItems, menuItem)]);
  };

  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem: HTMLElement | null = null;
    if (div) {
      const items: any = div.getElementsByClassName("side-nav-link-ref");
      for (let i = 0; i < items.length; ++i) {
        const trimmedURL = location?.pathname?.replaceAll(process.env.PUBLIC_URL || '', '');
        if (trimmedURL === items[i].pathname?.replaceAll(process.env.PUBLIC_URL, "")) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(menuItems, mid as any);
        if (activeMt) setActiveMenuItems([activeMt["key"], ...findAllParent(menuItems, activeMt)]);
      }
    }
  }, [location, menuItems]);

  useEffect(() => { activeMenu(); }, []);

  return (
    <ul className="menu" ref={menuRef} id="main-side-menu">
      {(menuItems || []).map((item, idx) => (
        <React.Fragment key={idx}>
          {item.isTitle ? (
            <li className="menu-title">{item.label}</li>
          ) : (
            <>
              {item.children ? (
                <MenuItemWithChildren item={item} toggleMenu={toggleMenu} subMenuClassNames="sub-menu" activeMenuItems={activeMenuItems} linkClassName={`menu-link ${activeMenuItems!.includes(item.key) ? 'active' : ''}`} />
              ) : (
                <MenuItem item={item} linkClassName={`menu-link ${activeMenuItems!.includes(item.key) ? 'active' : ''}`} />
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default AppMenu;
