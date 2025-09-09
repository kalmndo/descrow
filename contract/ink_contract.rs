#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod escrow {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    pub type Balance = <ink::env::DefaultEnvironment as ink::env::Environment>::Balance;
    pub type AgreementId = u32;

    /// Agreement status
    #[derive(scale::Encode, scale::Decode, Clone, Debug, PartialEq, Eq)]
    pub enum AgreementStatus {
        /// Initialized means the agreement has been submitted on chain
        Initialized,
        /// Deposited means the buyer has deposited the funds to the escrow account
        Deposited,
        /// Checking means the condition checking by both buyer and seller are on going
        Checking,
        /// Finalized means all the conditions have passed and the deal has been made
        Finalized,
    }

    #[derive(scale::Encode, scale::Decode, Clone, Debug)]
    pub enum EscrowError {
        AgreementNotFound,
        UnknownCaller,
        CanNotDeposit,
        CanNotCheck,
        CanNotTransfer,
        AlreadyFinalized,
        NoConditions
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Escrow {
        /// account holding the agreement funds
        holder: AccountId,
        /// list of agreements
        agreements: Mapping<AgreementId, Agreement>,
    }

    /// Agreement info
    #[derive(scale::Encode, scale::Decode, Clone, Debug, PartialEq, Eq)]
    pub struct Agreement {
        buyer: AccountId,
        seller: AccountId,
        total_amount: Balance,
        conditions: Vec<Condition>,
        status: AgreementStatus,
    }

    /// Agreement condition
    /// We don't really care what exactly those conditions are because different deal might have completely different conditions
    /// We want to abstract that out
    #[derive(scale::Encode, scale::Decode, Clone, Debug, PartialEq, Eq)]
    pub struct Condition {
        condition_name: String,
        condition_check_from_buyer: bool,
        condition_check_from_seller: bool,
    }

    impl Escrow {
        /// Constructor
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                agreements: Mapping::new(),
                holder: Self::env().account_id(),
            }
        }

        /// Initialize an agreement
        /// This will crate an agreement in storage and set the initial status to Initialized
        #[ink(message)]
        pub fn create_agreement(
            &mut self,
            agreement_id: AgreementId,
            buyer: AccountId,
            seller: AccountId,
            total_amount: Balance,
            conditions: Vec<Condition>,
        ) -> Result<(), EscrowError> {
            if conditions.is_empty() == 0 {
                return Err(EscrowError::NoConditions);
            }

            let agreement = Agreement {
                buyer: buyer,
                seller: seller,
                total_amount: total_amount,
                conditions: conditions,
                status: AgreementStatus::Initialized,
            };

            self.agreements.insert(agreement_id, &agreement);

            Ok(())
        }

        /// Buyer deposits the tx funds into holder account for their agreement
        #[ink(message, payable)]
        pub fn deposit(&mut self, agreement_id: AgreementId) -> Result<(), EscrowError> {
            let mut agreement = self.get_agreement(agreement_id)?;

            if agreement.status == AgreementStatus::Deposited {
                return Err(EscrowError::CanNotDeposit);
            }
            if agreement.status == AgreementStatus::Finalized {
                return Err(EscrowError::AlreadyFinalized);
            }

            // only the buyer can deposit
            let caller = Self::env().caller();
            if caller != agreement.buyer {
                return Err(EscrowError::UnknownCaller);
            }

            // buyer make the deposit to the holder account
            let transferred = self.env().transferred_value();

            if agreement.total_amount > transferred {
                return Err(EscrowError::CanNotDeposit);
            }

            agreement.status = AgreementStatus.Deposited;

            self.agreements.insert(agreement_id, &agreement);

            Ok(())
        }

        /// check one of the agreement condition
        /// can be called by either buyer or seller
        #[ink(message)]
        pub fn condition_check(
            &mut self,
            agreement_id: AgreementId,
            condition_name: String,
        ) -> Result<(), EscrowError> {
            let mut agreement = self.get_agreement(agreement_id)?;

            let caller = Self::env().caller();

            if caller != agreement.buyer && caller != agreement.seller {
                return Err(EscrowError::UnknownCaller);
            }

            // one agreement can be checked when it is in either Initialized, Deposited or Checking status
            if agreement.status == AgreementStatus::Finalized {
                return Err(EscrowError::AlreadyFinalized);
            }

            let mut found = false;
            for c in &mut agreement.conditions {
                if c.condition_name == condition_name {
                    found = true;
                    if caller == agreement.buyer {
                        c.condition_check_from_buyer = true;
                    } else {
                        c.condition_check_from_seller = true;
                    }
                }
            }
            if !found {
                return Err(EscrowError::CanNotCheck);
            }

            agreement.status = AgreementStatus::Checking;

            self.agreements.insert(agreement_id, &agreement);

            self.finalizing(&mut agreement, agreement_id)?;

            Ok(())
        }

        /// Try to finalize the agreement by checking all its conditions
        /// this method must be called by condition_check
        fn finalizing(
            &mut self,
            agreement: &mut Agreement,
            agreement_id: AgreementId,
        ) -> Result<(), EscrowError> {
            // after each check, we need to see if all the conditions are checked for this agreement
            // if not, status is still Checking
            // if so, the agreement will be finalized
            for c in &agreement.conditions {
                if !c.condition_check_from_seller || !c.condition_check_from_buyer {
                    // nothing change, agreement status is still Checking
                    return Ok(());
                }
            }
            // all checks are good, holder can release the funds to seller and the agreement is finalized
            self.env()
                .transfer(agreement.seller, agreement.total_amount)
                .map_err(|_| EscrowError::CanNotTransfer)?;

            agreement.status = AgreementStatus.Finalized;
            self.agreements.insert(agreement_id, &agreement);

            Ok(())
        }

        /// query agreement by agreement_id
        #[ink(message)]
        pub fn get_agreement(&self, agreement_id: AgreementId) -> Result<Agreement, EscrowError> {
            self.agreements
                .get(agreement_id)
                .ok_or(EscrowError::AgreementNotFound)
        }
    }

    // Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    // module and test functions are marked with a `#[test]` attribute.
    // The below code is technically just normal Rust code.
    // #[cfg(test)]
    // mod tests {
    //     /// Imports all the definitions from the outer scope so we can use them here.
    //     use super::*;
    //
    //     /// We test if the default constructor does its job.
    //     #[ink::test]
    //     fn default_works() {
    //         let escrow = Escrow::default();
    //         assert_eq!(escrow.get(), false);
    //     }
    //
    //     /// We test a simple use case of our contract.
    //     #[ink::test]
    //     fn it_works() {
    //         let mut escrow = Escrow::new(false);
    //         assert_eq!(escrow.get(), false);
    //         escrow.flip();
    //         assert_eq!(escrow.get(), true);
    //     }
    // }

    // This is how you'd write end-to-end (E2E) or integration tests for ink! contracts.
    //
    // When running these you need to make sure that you:
    // - Compile the tests with the `e2e-tests` feature flag enabled (`--features e2e-tests`)
    // - Are running a Substrate node which contains `pallet-contracts` in the background
    // #[cfg(all(test, feature = "e2e-tests"))]
    // mod e2e_tests {
    //     /// Imports all the definitions from the outer scope so we can use them here.
    //     use super::*;
    //
    //     /// A helper function used for calling contract messages.
    //     use ink_e2e::ContractsBackend;
    //
    //     /// The End-to-End test `Result` type.
    //     type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;
    //
    //     /// We test that we can upload and instantiate the contract using its default constructor.
    //     #[ink_e2e::test]
    //     async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         // Given
    //         let mut constructor = EscrowRef::default();
    //
    //         // When
    //         let contract = client
    //             .instantiate("escrow", &ink_e2e::alice(), &mut constructor)
    //             .submit()
    //             .await
    //             .expect("instantiate failed");
    //         let call_builder = contract.call_builder::<Escrow>();
    //
    //         // Then
    //         let get = call_builder.get();
    //         let get_result = client.call(&ink_e2e::alice(), &get).dry_run().await?;
    //         assert!(matches!(get_result.return_value(), false));
    //
    //         Ok(())
    //     }
    //
    //     /// We test that we can read and write a value from the on-chain contract.
    //     #[ink_e2e::test]
    //     async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
    //         // Given
    //         let mut constructor = EscrowRef::new(false);
    //         let contract = client
    //             .instantiate("escrow", &ink_e2e::bob(), &mut constructor)
    //             .submit()
    //             .await
    //             .expect("instantiate failed");
    //         let mut call_builder = contract.call_builder::<Escrow>();
    //
    //         let get = call_builder.get();
    //         let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
    //         assert!(matches!(get_result.return_value(), false));
    //
    //         // When
    //         let flip = call_builder.flip();
    //         let _flip_result = client
    //             .call(&ink_e2e::bob(), &flip)
    //             .submit()
    //             .await
    //             .expect("flip failed");
    //
    //         // Then
    //         let get = call_builder.get();
    //         let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
    //         assert!(matches!(get_result.return_value(), true));
    //
    //         Ok(())
    //     }
    // }
}
