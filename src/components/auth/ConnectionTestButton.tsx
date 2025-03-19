import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface ConnectionTestButtonProps {
  className?: string;
}

const ConnectionTestButton = ({ className }: ConnectionTestButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setStatus("Testing Supabase connection...");
    setDetails(null);

    try {
      // Call the test-connection edge function
      const { data, error } = await supabase.functions.invoke(
        "test-connection",
        {
          method: "POST",
        },
      );

      if (error) {
        console.error("Error testing connection:", error);
        setStatus(`Error: ${error.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Connection test response:", data);

      if (data?.success) {
        setStatus("Connection successful!");
        setDetails(data);
      } else {
        setStatus(`Connection failed: ${data?.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Exception testing connection:", error);
      setStatus(`Exception: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={handleTestConnection}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Testing..." : "Test Supabase Connection"}
      </Button>

      {status && (
        <div
          className={`mt-2 p-2 text-sm rounded ${details?.success ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
        >
          {status}

          {details && (
            <div className="mt-1 text-xs">
              <div>
                Database:{" "}
                {details.database.connected ? "Connected" : "Disconnected"}
              </div>
              <div>Users in DB: {details.database.userCount}</div>
              <div>
                Auth System:{" "}
                {details.auth.connected ? "Connected" : "Disconnected"}
              </div>
              <div>Users in Auth: {details.auth.userCount}</div>
              <div className="text-gray-500 mt-1">
                Timestamp: {new Date(details.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTestButton;
