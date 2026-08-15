"use client";

import { CreateItemForm } from "@/components/CreateItemForm";
import { InventoryList } from "@/components/InventoryList";
import { WalletRequiredBanner } from "@/components/WalletRequiredBanner";
import { useInventory } from "@/hooks/useInventory";
import { CONTRACT_ID } from "@/lib/stellar";

export function InventoryApp() {
  const {
    items,
    loading,
    actionLoading,
    error,
    message,
    loadInventory,
    createItem,
    deleteItem,
    clearFeedback,
  } = useInventory();

  return (
    <div className="space-y-6">
      <WalletRequiredBanner />
      {(error || message) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-neutral-200 bg-neutral-50 text-black"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <p>{error ?? message}</p>
            <button
              type="button"
              onClick={clearFeedback}
              className="cursor-pointer text-xs text-neutral-500 transition-colors hover:text-black"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <CreateItemForm onSubmit={createItem} loading={actionLoading} />
        <InventoryList
          items={items}
          loading={loading}
          actionLoading={actionLoading}
          onRefresh={loadInventory}
          onDelete={deleteItem}
        />
      </div>

      <p className="text-center font-mono text-xs text-neutral-400">
        Contract: {CONTRACT_ID}
      </p>
    </div>
  );
}
