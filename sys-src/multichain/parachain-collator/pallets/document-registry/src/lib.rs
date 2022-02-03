//! # Document Registry pallet

#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use core::result::Result;
use frame_support::{
    decl_error, decl_event, decl_module, decl_storage, dispatch, ensure, sp_runtime::RuntimeDebug,
    sp_std::prelude::*, traits::EnsureOrigin,
};
use frame_system::{self as system, ensure_signed};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

// General constraints to limit data size
pub const DOCUMENT_ID_MAX_LENGTH: usize = 36;
pub const DOCUMENT_PROP_NAME_MAX_LENGTH: usize = 10;
pub const DOCUMENT_PROP_VALUE_MAX_LENGTH: usize = 20;
pub const DOCUMENT_MAX_TITLE: usize = 3;

// Custom types
pub type DocumentId = Vec<u8>;
pub type DocumentOrganization = Vec<u8>;
pub type DocumentFile = Vec<u8>;
pub type PropName = Vec<u8>;
pub type PropValue = Vec<u8>;

#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug)]
pub struct Document<AccountId, Moment> {
    // The document ID
    id: DocumentId,
    // The account which owns the document
    owner: AccountId,
    // A series of properties describing the document
    title: Option<Vec<DocumentTitle>>,
    // The organization of the document
    document_organization: DocumentOrganization,
    // The associated document
    document_file: DocumentFile,
    // Timestamp at which the document was registered on-chain
    registered: Moment,
}

// Contains a name-value pair for a document property
#[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug)]
pub struct DocumentTitle {
    // Name of the document property
    name: PropName,
    // Value of the document property
    value: PropValue,
}

impl DocumentTitle {
    pub fn new(name: &[u8], value: &[u8]) -> Self {
        Self {
            name: name.to_vec(),
            value: value.to_vec(),
        }
    }
    pub fn name(&self) -> &[u8] {
        self.name.as_ref()
    }
    pub fn value(&self) -> &[u8] {
        self.value.as_ref()
    }
}

pub trait Trait: system::Trait + timestamp::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
    type CreateRoleOrigin: EnsureOrigin<Self::Origin>;
}

decl_storage! {
    trait Store for Module<T: Trait> as DocumentRegistry {
        pub Documents get(fn document_by_id): map hasher(blake2_128_concat) DocumentId => Option<Document<T::AccountId, T::Moment>>;
        pub DocumentsOfOrganization get(fn documents_of_org): map hasher(blake2_128_concat) T::AccountId => Vec<DocumentId>;
        pub OwnerOf get(fn owner_of): map hasher(blake2_128_concat) DocumentId => Option<T::AccountId>;
    }
}

decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        DocumentRegistered(AccountId, DocumentId, AccountId, DocumentOrganization),
    }
);

decl_error! {
    pub enum Error for Module<T: Trait> {
        DocumentIdMissing,
        DocumentIdTooLong,
        DocumentIdExists,
        DocumentTooManyTitle,
        DocumentInvalidPropName,
        DocumentInvalidPropValue
    }
}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        type Error = Error<T>;
        fn deposit_event() = default;

        /// Register document for an organization and share it with selected organizations.
        #[weight = 10_000]
        pub fn register_document(origin, id: DocumentId, owner: T::AccountId, title: Option<Vec<DocumentTitle>>, document_organization: DocumentOrganization, document_file: DocumentFile) -> dispatch::DispatchResult {
            T::CreateRoleOrigin::ensure_origin(origin.clone())?;
            let who = ensure_signed(origin)?;

            // Validate document ID
            Self::validate_document_id(&id)?;

            // Validate document title
            Self::validate_document_title(&title)?;

            // Validate document title
            Self::validate_new_document(&id)?;

            let document = Self::new_document()
                .identified_by(id.clone())
                .owned_by(owner.clone())
                .registered_on(<timestamp::Module<T>>::now())
                .with_title(title)
                .with_organization(document_organization.clone())
                .with_file(document_file.clone())
                .build();

            <Documents<T>>::insert(&id, document);
            <DocumentsOfOrganization<T>>::append(&owner, &id);
            <OwnerOf<T>>::insert(&id, &owner);

            Self::deposit_event(RawEvent::DocumentRegistered(who, id, owner, document_organization));

            Ok(())
        }
    }
}

impl<T: Trait> Module<T> {
    // Helper methods
    fn new_document() -> DocumentBuilder<T::AccountId, T::Moment> {
        DocumentBuilder::<T::AccountId, T::Moment>::default()
    }

    pub fn validate_document_id(id: &[u8]) -> Result<(), Error<T>> {
        // Basic document ID validation
        ensure!(!id.is_empty(), Error::<T>::DocumentIdMissing);
        ensure!(
            id.len() <= DOCUMENT_ID_MAX_LENGTH,
            Error::<T>::DocumentIdTooLong
        );
        Ok(())
    }

    pub fn validate_new_document(id: &[u8]) -> Result<(), Error<T>> {
        // Document existence check
        ensure!(
            !<Documents<T>>::contains_key(id),
            Error::<T>::DocumentIdExists
        );
        Ok(())
    }

    pub fn validate_document_title(title: &Option<Vec<DocumentTitle>>) -> Result<(), Error<T>> {
        if let Some(title) = title {
            ensure!(
                title.len() <= DOCUMENT_MAX_TITLE,
                Error::<T>::DocumentTooManyTitle,
            );
            for prop in title {
                ensure!(
                    prop.name().len() <= DOCUMENT_PROP_NAME_MAX_LENGTH,
                    Error::<T>::DocumentInvalidPropName
                );
                ensure!(
                    prop.value().len() <= DOCUMENT_PROP_VALUE_MAX_LENGTH,
                    Error::<T>::DocumentInvalidPropValue
                );
            }
        }
        Ok(())
    }
}

#[derive(Default)]
pub struct DocumentBuilder<AccountId, Moment>
    where
        AccountId: Default,
        Moment: Default,
{
    id: DocumentId,
    owner: AccountId,
    title: Option<Vec<DocumentTitle>>,
    document_organization: DocumentOrganization,
    document_file: DocumentFile,
    registered: Moment,
}

impl<AccountId, Moment> DocumentBuilder<AccountId, Moment>
    where
        AccountId: Default,
        Moment: Default,
{
    pub fn identified_by(mut self, id: DocumentId) -> Self {
        self.id = id;
        self
    }

    pub fn owned_by(mut self, owner: AccountId) -> Self {
        self.owner = owner;
        self
    }

    pub fn with_title(mut self, title: Option<Vec<DocumentTitle>>) -> Self {
        self.title = title;
        self
    }

    pub fn with_organization(mut self, document_organization: DocumentOrganization) -> Self {
        self.document_organization = document_organization;
        self
    }

    pub fn with_file(mut self, document_file: DocumentFile) -> Self {
        self.document_file = document_file;
        self
    }

    pub fn registered_on(mut self, registered: Moment) -> Self {
        self.registered = registered;
        self
    }

    pub fn build(self) -> Document<AccountId, Moment> {
        Document::<AccountId, Moment> {
            id: self.id,
            owner: self.owner,
            title: self.title,
            document_organization: self.document_organization,
            document_file: self.document_file,
            registered: self.registered,
        }
    }
}
