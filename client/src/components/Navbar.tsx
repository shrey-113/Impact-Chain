// src/components/Navbar.tsx

import { useState } from "react";
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

import { IoIosWallet } from "react-icons/io";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";
import CreateWalletButton from './CreateWalletButton'; // Import CreateWalletButton

type NavbarProps = {
  connectedAddress: string | null;
  onConnect: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ connectedAddress, onConnect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

          {/* Mobile Navigation */}
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
          {/* Desktop Wallet Button and Mode Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* If no wallet connected, show CreateWalletButton */}
            {!connectedAddress ? (
              <CreateWalletButton onConnect={onConnect} />
            ) : (
              <div className="text-sm text-gray-500">Connected: {connectedAddress}</div>
            )}

            <a
              rel="noreferrer noopener"
              href="https://github.com/leoMirandaa/shadcn-landing-page.git"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })} flex items-center gap-2`}
            >
              <IoIosWallet className="mr-2 w-5 h-5" />
              Wallet
            </a>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
