"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useFreighter } from "@/hooks/useFreighter";

export function WalletRequiredBanner() {
  const { connected, loading, connect } = useFreighter();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || connected) {
    return null;
  }

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg" aria-hidden>
            🔒
          </span>
          <div>
            <p className="font-medium text-amber-950">Wallet connection required</p>
            <p className="mt-1 text-sm text-amber-800">
              Connect your Freighter wallet to add or delete inventory items.
              Viewing the list is available without login.
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>
        <Button
          variant="success"
          onClick={handleConnect}
          disabled={connecting}
          className="shrink-0"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}
