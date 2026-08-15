#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String};

fn setup() -> (Env, InventoryContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(InventoryContract, ());
    let client = InventoryContractClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn get_inventory_returns_empty_initially() {
    let (_env, client) = setup();
    assert_eq!(client.get_inventory().len(), 0);
}

#[test]
fn create_item_adds_inventory_entry() {
    let (env, client) = setup();

    let message = client.create_item(
        &String::from_str(&env, "Laptop"),
        &10,
        &15_000_000,
        &String::from_str(&env, "Operational laptop"),
    );

    assert_eq!(message, String::from_str(&env, "Item added successfully"));

    let inventory = client.get_inventory();
    assert_eq!(inventory.len(), 1);

    let item = inventory.get(0).unwrap();
    assert_eq!(item.name, String::from_str(&env, "Laptop"));
    assert_eq!(item.quantity, 10);
    assert_eq!(item.price, 15_000_000);
    assert_eq!(
        item.description,
        String::from_str(&env, "Operational laptop")
    );
}

#[test]
fn delete_item_removes_matching_entry() {
    let (env, client) = setup();

    client.create_item(
        &String::from_str(&env, "Mouse"),
        &5,
        &150_000,
        &String::from_str(&env, "Wireless mouse"),
    );

    let item_id = client.get_inventory().get(0).unwrap().id;
    let message = client.delete_item(&item_id);

    assert_eq!(message, String::from_str(&env, "Item deleted successfully"));
    assert_eq!(client.get_inventory().len(), 0);
}

#[test]
fn delete_item_returns_not_found_for_missing_id() {
    let (env, client) = setup();

    let message = client.delete_item(&99_999);

    assert_eq!(message, String::from_str(&env, "Item not found"));
}
