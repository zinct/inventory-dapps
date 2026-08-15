"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useFreighter } from "@/hooks/useFreighter";
import { shortenAddress } from "@/lib/stellar";

export function WalletButton() {
  const {
    connected,
    address,
    network,
    installed,
    loading,
    connect,
    disconnect,
  } = useFreighter();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <Button variant="secondary" disabled>
        Loading wallet...
      </Button>
    );
  }

  if (!installed) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-emerald-700 active:scale-[0.98]"
      >
        Install Freighter
      </a>
    );
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-right text-xs">
          <p className="font-medium text-emerald-800">Connected</p>
          <p className="font-mono text-emerald-950">{shortenAddress(address)}</p>
          <p className="text-emerald-700">{network ?? "testnet"}</p>
        </div>
        <Button variant="secondary" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="success" onClick={handleConnect} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      {error && <p className="max-w-xs text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
