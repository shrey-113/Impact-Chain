import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";
import CreateWalletButton from './CreateWalletButton';
import { connectWallet } from '..//provider';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, setState] = useState<{ address: string | null }>({ address: null });

  // Check for a previously connected wallet address in local storage
  useEffect(() => {
    const storedAddress = localStorage.getItem('connectedAddress');
    if (storedAddress) {
      setState({ address: storedAddress });
    }
  }, []);

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setState({ address });
      localStorage.setItem('connectedAddress', address);
    }
  };

  const handleDisconnectWallet = () => {
    setState({ address: null });
    localStorage.removeItem('connectedAddress');
  };

  const connectedAddress = state.address;

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex items-center gap-2"
            >
              <LogoIcon />
              Impact-Chain
            </a>
          </NavigationMenuItem>

          <span className="flex md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Impact-Chain
                  </SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </span>

          <div className="hidden md:flex items-center gap-4">
            {!connectedAddress ? (
              <CreateWalletButton onConnect={handleConnectWallet} />
            ) : (
              <>
                <div className="text-sm text-gray-500">Connected: {connectedAddress}</div>
                <Link to="/">
                  <button onClick={handleDisconnectWallet}>Disconnect</button>
                </Link>
              </>
            )}

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};