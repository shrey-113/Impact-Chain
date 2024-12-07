import React from "react";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { IoIosWallet } from "react-icons/io"; // Ensure you have this import for the icon
import { buttonVariants } from "./ui/button";

const MyComponent = () => {
  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent the default link behavior
    console.log("Ratnesh gandus");
    try {
      let coinbase = Coinbase.configure({
        apiKeyName:
          "organizations/ccf66a79-caf1-4660-aa0d-23e7dd50a014/apiKeys/2f6395ed-984b-431d-bfc1-5982deeea60d",
        privateKey:
          "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIAE/J4K6xsr6YjyKzKl1cD/rnp1RVxU9A4XdwDTXoL6KoAoGCCqGSM49\nAwEHoUQDQgAENe+XpF6Nn4CIYNvxjflJH95SY2pgnRQ7/UcQYeXAy8Izb2QhV3oV\ni7eKlsGpZxLIgAIiUf8q1cJ99TRsfCfPXA==\n-----END EC PRIVATE KEY-----\n",
      });
      // console.log(coinbase)
      // // Create a Wallet
      // let wallet = await Wallet.create();
      // console.log(`Wallet successfully created: `, wallet.toString());
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  return (
    <a
      rel="noreferrer noopener"
      href="#"
      onClick={handleClick} // Attach the click handler
      className={`border ${buttonVariants({ variant: "secondary" })}`}
    >
      <IoIosWallet className="mr-2 w-5 h-5" />
      Wallet
    </a>
  );
};

export default MyComponent;
