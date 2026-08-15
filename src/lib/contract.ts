import { Client, type InventoryItem } from "bindings";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import {
  CONTRACT_ID,
  NETWORK_PASSPHRASE,
  RPC_URL,
} from "@/lib/stellar";

type SignTransaction = NonNullable<
  ConstructorParameters<typeof Client>[0]["signTransaction"]
>;

export function createContractClient(
  publicKey?: string,
  signTransaction?: SignTransaction,
): Client {
  return new Client({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    ...(publicKey ? { publicKey } : {}),
    ...(signTransaction ? { signTransaction } : {}),
  });
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const client = createContractClient();
  const tx = await client.get_inventory();
  return tx.result ?? [];
}

export async function createInventoryItem(
  publicKey: string,
  signTransaction: SignTransaction,
  item: {
    name: string;
    quantity: bigint;
    price: bigint;
    description: string;
  },
): Promise<string> {
  const client = createContractClient(publicKey, signTransaction);
  const tx = await client.create_item(item);
  const sent = await signAndSend(tx);
  return sent.result ?? "";
}

export async function deleteInventoryItem(
  publicKey: string,
  signTransaction: SignTransaction,
  id: bigint,
): Promise<string> {
  const client = createContractClient(publicKey, signTransaction);
  const tx = await client.delete_item({ id });
  const sent = await signAndSend(tx);
  return sent.result ?? "";
}

async function signAndSend<T>(tx: AssembledTransaction<T>) {
  const sent = await tx.signAndSend();
  return sent;
}

export type { InventoryItem };
