// components/flush-cache.tsx
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function FlushCache() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const handleFlushCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/flushCache", {
        method: "POST",
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while flushing the cache.");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screenpx-4">
      <section className="w-full max-w-2xl p-8 md:p-12 lg:p-16 rounded-xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">
          Job Board Cache Flush
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Click the button below to flush the cache of the API endpoint.
        </p>
        <div className="flex justify-center">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
            onClick={handleFlushCache}
            disabled={isLoading}
          >
            {isLoading ? "Flushing Cache..." : "Flush Cache"}
          </Button>
        </div>
        {message && <p className="text-center mt-4">{message}</p>}
      </section>
    </main>
  );
}