import React from 'react';
import {useLocation} from '@docusaurus/router';
import DocSidebarItemLink from '@theme-original/DocSidebarItem/Link';

export default function SidebarLink(props) {
  const {pathname, hash} = useLocation();
  if (!props.item.customProps?.chapterSection) return <DocSidebarItemLink {...props}/>;

  const activePath = pathname + hash;
  return <DocSidebarItemLink {...props} activePath={activePath}
    aria-current={props.item.href === activePath ? 'location' : undefined}/>;
}
