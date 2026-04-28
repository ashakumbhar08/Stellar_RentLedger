#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Vec,
};

// ─── Storage Keys ────────────────────────────────────────────────────────────

// ─── Data Types ──────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct Property {
    pub id: u64,
    pub landlord: Address,
    pub name: String,
    pub address: String,
    pub rent_amount: i128,   // in stroops (1 XLM = 10_000_000 stroops)
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct PaymentRecord {
    pub id: u64,
    pub property_id: u64,
    pub tenant: Address,
    pub landlord: Address,
    pub amount: i128,
    pub month: String,       // e.g. "2024-01"
    pub memo: String,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Property(u64),
    Payment(u64),
    LandlordProps(Address),
    TenantPayments(Address),
    PropertyPayments(u64),
}

// ─── Contract ────────────────────────────────────────────────────────────────

#[contract]
pub struct RentLedger;

#[contractimpl]
impl RentLedger {

    // ── Property Management ──────────────────────────────────────────────────

    /// Landlord registers a property. Returns the new property ID.
    pub fn register_property(
        env: Env,
        landlord: Address,
        name: String,
        property_address: String,
        rent_amount: i128,
    ) -> u64 {
        landlord.require_auth();

        assert!(rent_amount > 0, "Rent must be positive");

        let id: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("PROP_CNT"))
            .unwrap_or(0u64)
            + 1;

        let property = Property {
            id,
            landlord: landlord.clone(),
            name,
            address: property_address,
            rent_amount,
            active: true,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Property(id), &property);

        // Track landlord's property list
        let mut props: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::LandlordProps(landlord.clone()))
            .unwrap_or(Vec::new(&env));
        props.push_back(id);
        env.storage()
            .persistent()
            .set(&DataKey::LandlordProps(landlord), &props);

        env.storage()
            .instance()
            .set(&symbol_short!("PROP_CNT"), &id);

        env.events().publish(
            (symbol_short!("prop_reg"), id),
            id,
        );

        id
    }

    /// Deactivate a property (landlord only).
    pub fn deactivate_property(env: Env, landlord: Address, property_id: u64) {
        landlord.require_auth();

        let mut property: Property = env
            .storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .expect("Property not found");

        assert!(property.landlord == landlord, "Not the property owner");
        property.active = false;

        env.storage()
            .persistent()
            .set(&DataKey::Property(property_id), &property);
    }

    // ── Payment Recording ────────────────────────────────────────────────────

    /// Tenant records a rent payment on-chain.
    /// The actual XLM transfer happens via Stellar's native payment operation;
    /// this contract stores the verified receipt.
    pub fn record_payment(
        env: Env,
        tenant: Address,
        property_id: u64,
        amount: i128,
        month: String,
        memo: String,
    ) -> u64 {
        tenant.require_auth();

        let property: Property = env
            .storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .expect("Property not found");

        assert!(property.active, "Property is not active");
        assert!(amount > 0, "Amount must be positive");

        let id: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("PAY_CNT"))
            .unwrap_or(0u64)
            + 1;

        let record = PaymentRecord {
            id,
            property_id,
            tenant: tenant.clone(),
            landlord: property.landlord.clone(),
            amount,
            month: month.clone(),
            memo,
            timestamp: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Payment(id), &record);

        // Track tenant's payment list
        let mut tenant_pays: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::TenantPayments(tenant.clone()))
            .unwrap_or(Vec::new(&env));
        tenant_pays.push_back(id);
        env.storage()
            .persistent()
            .set(&DataKey::TenantPayments(tenant.clone()), &tenant_pays);

        // Track property's payment list
        let mut prop_pays: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::PropertyPayments(property_id))
            .unwrap_or(Vec::new(&env));
        prop_pays.push_back(id);
        env.storage()
            .persistent()
            .set(&DataKey::PropertyPayments(property_id), &prop_pays);

        env.storage()
            .instance()
            .set(&symbol_short!("PAY_CNT"), &id);

        env.events().publish(
            (symbol_short!("pay_rec"), property_id),
            (id, tenant.clone(), amount),
        );

        id
    }

    // ── Read Functions ───────────────────────────────────────────────────────

    /// Get a property by ID.
    pub fn get_property(env: Env, property_id: u64) -> Property {
        env.storage()
            .persistent()
            .get(&DataKey::Property(property_id))
            .expect("Property not found")
    }

    /// Get a payment record by ID.
    pub fn get_payment(env: Env, payment_id: u64) -> PaymentRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Payment(payment_id))
            .expect("Payment not found")
    }

    /// Get all property IDs for a landlord.
    pub fn get_landlord_properties(env: Env, landlord: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::LandlordProps(landlord))
            .unwrap_or(Vec::new(&env))
    }

    /// Get all payment IDs for a tenant.
    pub fn get_tenant_payments(env: Env, tenant: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::TenantPayments(tenant))
            .unwrap_or(Vec::new(&env))
    }

    /// Get all payment IDs for a property.
    pub fn get_property_payments(env: Env, property_id: u64) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::PropertyPayments(property_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Total properties registered.
    pub fn property_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&symbol_short!("PROP_CNT"))
            .unwrap_or(0u64)
    }

    /// Total payments recorded.
    pub fn payment_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&symbol_short!("PAY_CNT"))
            .unwrap_or(0u64)
    }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String};

    #[test]
    fn test_register_and_pay() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, RentLedger);
        let client = RentLedgerClient::new(&env, &contract_id);

        let landlord = Address::generate(&env);
        let tenant = Address::generate(&env);

        // Register property
        let prop_id = client.register_property(
            &landlord,
            &String::from_str(&env, "Sunset Apt 4B"),
            &String::from_str(&env, "123 Main St"),
            &5_000_000_000i128, // 500 XLM in stroops
        );
        assert_eq!(prop_id, 1);

        // Verify property
        let prop = client.get_property(&prop_id);
        assert_eq!(prop.landlord, landlord);
        assert!(prop.active);

        // Record payment
        let pay_id = client.record_payment(
            &tenant,
            &prop_id,
            &5_000_000_000i128,
            &String::from_str(&env, "2024-01"),
            &String::from_str(&env, "January rent"),
        );
        assert_eq!(pay_id, 1);

        // Verify receipt
        let receipt = client.get_payment(&pay_id);
        assert_eq!(receipt.tenant, tenant);
        assert_eq!(receipt.landlord, landlord);
        assert_eq!(receipt.amount, 5_000_000_000i128);

        // Check indexes
        let landlord_props = client.get_landlord_properties(&landlord);
        assert_eq!(landlord_props.len(), 1);

        let tenant_pays = client.get_tenant_payments(&tenant);
        assert_eq!(tenant_pays.len(), 1);
    }

    #[test]
    fn test_deactivate_property() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, RentLedger);
        let client = RentLedgerClient::new(&env, &contract_id);

        let landlord = Address::generate(&env);

        let prop_id = client.register_property(
            &landlord,
            &String::from_str(&env, "Test Property"),
            &String::from_str(&env, "456 Oak Ave"),
            &1_000_000_000i128,
        );

        client.deactivate_property(&landlord, &prop_id);
        let prop = client.get_property(&prop_id);
        assert!(!prop.active);
    }
}
