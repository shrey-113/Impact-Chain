// AllCauses.tsx
import { UseCauseCard } from "./UseCauseCard.tsx";

export const AllCauses = () => {
  // You can create an array of cards to render multiple instances
  const cardCount = 16; // Number of cards you want to display

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ml-60">
      {Array.from({ length: cardCount }).map((_, index) => (
        <div key={index} className="flex justify-center">
          <UseCauseCard />
        </div>
      ))}
    </div>
  );
};