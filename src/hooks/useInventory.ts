"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createInventoryItem,
  deleteInventoryItem,
  fetchInventory,
  type InventoryItem,
} from "@/lib/contract";
import { useFreighter } from "@/hooks/useFreighter";

export function useInventory() {
  const { address, connected, sign } = useFreighter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inventory = await fetchInventory();
      setItems(inventory);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load inventory",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const createItem = useCallback(
    async (form: {
      name: string;
      quantity: string;
      price: string;
      description: string;
    }) => {
      if (!connected || !address) {
        throw new Error("Connect your Freighter wallet first");
      }

      setActionLoading(true);
      setError(null);
      setMessage(null);

      try {
        const result = await createInventoryItem(address, sign, {
          name: form.name.trim(),
          quantity: BigInt(form.quantity),
          price: BigInt(form.price),
          description: form.description.trim(),
        });
        setMessage(result);
        await loadInventory();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to add item";
        setError(msg);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [address, connected, loadInventory, sign],
  );

  const deleteItem = useCallback(
    async (id: bigint) => {
      if (!connected || !address) {
        throw new Error("Connect your Freighter wallet first");
      }

      setActionLoading(true);
      setError(null);
      setMessage(null);

      try {
        const result = await deleteInventoryItem(address, sign, id);
        setMessage(result);
        await loadInventory();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to delete item";
        setError(msg);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [address, connected, loadInventory, sign],
  );

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return {
    items,
    loading,
    actionLoading,
    error,
    message,
    loadInventory,
    createItem,
    deleteItem,
    clearFeedback,
  };
}
