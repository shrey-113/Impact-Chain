import { TbBrandTorchain } from "react-icons/tb";
import { NGO_DASHBOARD_SIDEBAR_LINKS, NGO_DASHBOARD_SIDEBAR_LINKS_BOTTOM } from '../../consts/Navigation';
import { Link } from 'react-router-dom';

const linkClasses = "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline";

interface SidebarLinkProps {
  item: {
    key: string;
    label: string;
    path: string;
    icon: JSX.Element;
  };
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item }) => {
  return (
    <Link to={item.path} className={linkClasses}>
      <span className='text-xl'>{item.icon}</span>
      {item.label}
    </Link>
  );
};

const NgoSidebar: React.FC = () => {
  return (
    <div className='fixed bg-stone-1000 flex flex-col w-60 text-white h-screen border-r-2 border-zinc-900'>
      <div className='flex'>
        <div className='flex items-center gap-2 pt-4 pl-2'>
          <div className='pt-1 px-2'><TbBrandTorchain fontSize={20} /></div>
          <div className='text-xl pt-1'>Impact-Chain</div>
        </div>
      </div>
      <div className='flex-1 pl-2 pt-10'>
        {NGO_DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
      <div className='pl-2 pt-10'>
        {NGO_DASHBOARD_SIDEBAR_LINKS_BOTTOM.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
};

export default NgoSidebar;