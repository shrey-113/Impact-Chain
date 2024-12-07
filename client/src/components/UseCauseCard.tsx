import {
    CauseCard,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/CauseCard";
  
  export const UseCauseCard = () => {
    return ( 
        <div className="w-60 h-60">
      <CauseCard>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </CauseCard>
      </div>
    );
  };