import { Button } from "./ui/button";
import Globe from '../assets/globe.png'
import {Navbar} from './Navbar.tsx'
import { connectWallet } from '..//provider'; // Assuming this handles the wallet connection
import { useState } from "react";
import { Link } from "react-router-dom";

type AppState = {
  address: string | null;
};

export const Hero = () => {
  const [state, setState] = useState<AppState>({ address: null });

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setState({ address }); // Store the connected address in state
    }
  };


  return (
    <>  
    <Navbar />
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 pl-40">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Impact-Chain
            </span>{" "}
            a platform
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Research
            </span>{" "}
            and
          </h2>
          <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Welfare
            </span>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Donate to NGOs, publish your datasets, validate datasets and get rewards!
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
        <Link to="/ngo" className="w-full md:w-1/3">
          <Button className="w-full md:w-1/3">Sign In as NGO</Button>
        </Link>
        <Link to="/contributor" className="w-full md:w-1/3">
          <Button className="w-full md:w-1/3">Sign In as Contributor</Button>
        </Link>
          

        </div>
      </div>

      {/* Hero cards sections */}
      <div>
        <img className="h-80" src={Globe} alt="Logo" />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
    </>
  );
};
