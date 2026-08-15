"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { useFreighter } from "@/hooks/useFreighter";

interface CreateItemFormProps {
  onSubmit: (form: {
    name: string;
    quantity: string;
    price: string;
    description: string;
  }) => Promise<void>;
  loading: boolean;
}

const initialForm = {
  name: "",
  quantity: "",
  price: "",
  description: "",
};

export function CreateItemForm({ onSubmit, loading }: CreateItemFormProps) {
  const { connected } = useFreighter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setAuthError(null);

    if (!connected) {
      setAuthError("Please connect your wallet before adding items.");
      return;
    }

    if (!form.name.trim()) {
      setError("Item name is required");
      return;
    }

    if (!form.quantity || Number(form.quantity) < 0) {
      setError("Quantity must be a valid number");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Price must be a valid number");
      return;
    }

    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    }
  };

  return (
    <section
      className={`relative rounded-lg border bg-white p-6 transition-colors ${
        connected ? "border-neutral-200" : "border-amber-200 bg-amber-50/30"
      }`}
    >
      {!connected && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-lg bg-white/40 backdrop-blur-[1px]" />
      )}

      <div className={connected ? "" : "opacity-60"}>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-black">Add Item</h2>
          {!connected && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Login required
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          Save data to the Soroban smart contract on testnet.
        </p>

        <form onSubmit={handleSubmit} className="relative z-20 mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-black">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
              placeholder="Lenovo Laptop"
              disabled={loading || !connected}
              readOnly={!connected}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="quantity"
                className="mb-1 block text-sm font-medium text-black"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, quantity: e.target.value }))
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
                placeholder="10"
                disabled={loading || !connected}
                readOnly={!connected}
              />
            </div>

            <div>
              <label htmlFor="price" className="mb-1 block text-sm font-medium text-black">
                Price
              </label>
              <input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
                placeholder="15000000"
                disabled={loading || !connected}
                readOnly={!connected}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-black"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black disabled:cursor-not-allowed disabled:bg-neutral-100"
              placeholder="Laptop for operational needs"
              disabled={loading || !connected}
              readOnly={!connected}
            />
          </div>

          {authError && (
            <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {authError}
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            variant={connected ? "primary" : "secondary"}
            disabled={loading}
            className="w-full"
            onClick={() => {
              if (!connected) {
                setAuthError("Please connect your wallet before adding items.");
              }
            }}
          >
            {loading ? "Saving..." : connected ? "Add Item" : "Connect wallet to add items"}
          </Button>
        </form>
      </div>
    </section>
  );
}
