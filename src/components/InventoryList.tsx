"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { InventoryItem } from "@/lib/contract";
import { formatPrice } from "@/lib/stellar";
import { useFreighter } from "@/hooks/useFreighter";

interface InventoryListProps {
  items: InventoryItem[];
  loading: boolean;
  actionLoading: boolean;
  onRefresh: () => void;
  onDelete: (id: bigint) => Promise<void>;
}

export function InventoryList({
  items,
  loading,
  actionLoading,
  onRefresh,
  onDelete,
}: InventoryListProps) {
  const { connected } = useFreighter();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleDelete = async (id: bigint) => {
    if (!connected) {
      setAuthError("Please connect your wallet before deleting items.");
      return;
    }

    setAuthError(null);

    if (!confirm("Are you sure you want to delete this item?")) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black">Inventory List</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Data is read directly from the smart contract.
          </p>
        </div>
        <Button variant="secondary" onClick={onRefresh} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {authError && (
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {authError}
        </p>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center py-12">
          <p className="text-sm text-neutral-500">Loading inventory...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-neutral-300 py-12 text-center">
          <p className="text-sm text-neutral-500">No items in inventory yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="px-3 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Quantity</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium">Description</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id.toString()} className="border-b border-neutral-100">
                  <td className="px-3 py-4 font-mono text-xs text-neutral-600">
                    {item.id.toString()}
                  </td>
                  <td className="px-3 py-4 font-medium text-black">{item.name}</td>
                  <td className="px-3 py-4 text-black">{item.quantity.toString()}</td>
                  <td className="px-3 py-4 text-black">{formatPrice(item.price)}</td>
                  <td className="px-3 py-4 text-neutral-600">{item.description}</td>
                  <td className="px-3 py-4">
                    <Button
                      variant={connected ? "danger" : "secondary"}
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading || deletingId === item.id}
                      className="px-3 py-1.5 text-xs"
                      title={
                        connected
                          ? "Delete this item"
                          : "Connect wallet to delete items"
                      }
                    >
                      {deletingId === item.id
                        ? "Deleting..."
                        : connected
                          ? "Delete"
                          : "Login to delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!connected && items.length > 0 && !authError && (
        <p className="mt-4 text-sm text-amber-700">
          Delete actions require a connected wallet.
        </p>
      )}
    </section>
  );
}
