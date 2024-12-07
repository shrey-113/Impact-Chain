import { CauseCardWithDescription } from "@/components/ui/CauseCard";

interface UseCauseCardProps {
  title: string;
  description: string;
}

export const UseCauseCard: React.FC<UseCauseCardProps> = ({ title, description }) => {
  return (
    <div className="w-60 h-60">
      <CauseCardWithDescription
        title={title}
        description={description}
      />
    </div>
  );
};