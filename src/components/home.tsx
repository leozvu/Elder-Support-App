import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-primary mb-8">
        Senior Assist Platform
      </h1>
      <div className="space-y-4 w-full max-w-md">
        <Link to="/" className="w-full block">
          <Button className="w-full text-xl py-6" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
