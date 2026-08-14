#![no_std]

use soroban_sdk::{
    contract,
    contractimpl,
    contracttype,
    symbol_short,
    Env,
    String,
    Symbol,
    Vec,
};

// Struktur data untuk menyimpan barang inventory
#[contracttype]
#[derive(Clone, Debug)]
pub struct InventoryItem {
    id: u64,
    name: String,
    quantity: u64,
    price: u64,
    description: String,
}

// Storage key untuk data inventory
const INVENTORY_DATA: Symbol = symbol_short!("INVENTORY");

#[contract]
pub struct InventoryContract;

#[contractimpl]
impl InventoryContract {
    // Fungsi untuk mengambil seluruh data inventory
    pub fn get_inventory(env: Env) -> Vec<InventoryItem> {
        env.storage()
            .instance()
            .get(&INVENTORY_DATA)
            .unwrap_or(Vec::new(&env))
    }

    // Fungsi untuk menambahkan barang baru
    pub fn create_item(
        env: Env,
        name: String,
        quantity: u64,
        price: u64,
        description: String,
    ) -> String {
        // 1. Ambil data inventory dari storage
        let mut inventory: Vec<InventoryItem> = env
            .storage()
            .instance()
            .get(&INVENTORY_DATA)
            .unwrap_or(Vec::new(&env));

        // 2. Buat object inventory baru
        let item = InventoryItem {
            id: env.prng().gen::<u64>(),
            name,
            quantity,
            price,
            description,
        };

        // 3. Tambahkan barang ke inventory
        inventory.push_back(item);

        // 4. Simpan kembali inventory ke storage
        env.storage()
            .instance()
            .set(&INVENTORY_DATA, &inventory);

        String::from_str(&env, "Barang berhasil ditambahkan")
    }

    // Fungsi untuk menghapus barang berdasarkan ID
    pub fn delete_item(env: Env, id: u64) -> String {
        // 1. Ambil data inventory
        let mut inventory: Vec<InventoryItem> = env
            .storage()
            .instance()
            .get(&INVENTORY_DATA)
            .unwrap_or(Vec::new(&env));

        // 2. Cari barang berdasarkan ID
        for i in 0..inventory.len() {
            if inventory.get(i).unwrap().id == id {
                // 3. Hapus barang
                inventory.remove(i);

                // 4. Simpan perubahan
                env.storage()
                    .instance()
                    .set(&INVENTORY_DATA, &inventory);

                return String::from_str(&env, "Barang berhasil dihapus");
            }
        }

        String::from_str(&env, "Barang tidak ditemukan")
    }
}

mod test;