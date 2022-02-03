use super::*;
use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok, dispatch};

const TEST_DOCUMENT_ID: &str = "0x31";
const TEST_ORGANIZATION: &str = "Supply Chain Consortium";
const TEST_SENDER: &str = "Alice";
const LONG_VALUE : &str = "A very long nonsense value for testing purposes";

#[test]
fn create_document_without_title() {
    new_test_ext().execute_with(|| {
        let sender = account_key(TEST_SENDER);
        let id = TEST_DOCUMENT_ID.as_bytes().to_owned();
        let owner = account_key(TEST_ORGANIZATION);
        let now = 42;
        Timestamp::set_timestamp(now);

        let result = DocumentRegistry::register_document(
            Origin::signed(sender),
            id.clone(),
            owner.clone(),
            None,
        );

        assert_ok!(result);

        assert_eq!(
            DocumentRegistry::document_by_id(&id),
            Some(Document {
                id: id.clone(),
                owner: owner,
                registered: now,
                title: None
            })
        );

        assert_eq!(<DocumentsOfOrganization<Test>>::get(owner), vec![id.clone()]);

        assert_eq!(DocumentRegistry::owner_of(&id), Some(owner));

        // Event is raised
        assert!(System::events().iter().any(|er| er.event
            == TestEvent::document_registry(RawEvent::DocumentRegistered(
            sender,
            id.clone(),
            owner
        ))));
    });
}

#[test]
fn create_document_with_valid_title() {
    new_test_ext().execute_with(|| {
        let sender = account_key(TEST_SENDER);
        let id = TEST_DOCUMENT_ID.as_bytes().to_owned();
        let owner = account_key(TEST_ORGANIZATION);
        let now = 42;
        Timestamp::set_timestamp(now);

        let result = DocumentRegistry::register_document(
            Origin::signed(sender),
            id.clone(),
            owner.clone(),
            Some(vec![
                DocumentProperty::new(b"prop1", b"val1"),
                DocumentProperty::new(b"prop2", b"val2"),
                DocumentProperty::new(b"prop3", b"val3"),
            ]),
        );

        assert_ok!(result);

        assert_eq!(
            DocumentRegistry::document_by_id(&id),
            Some(Document {
                id: id.clone(),
                owner: owner,
                registered: now,
                title: Some(vec![
                    DocumentProperty::new(b"prop1", b"val1"),
                    DocumentProperty::new(b"prop2", b"val2"),
                    DocumentProperty::new(b"prop3", b"val3"),
                ]),
            })
        );

        assert_eq!(<DocumentsOfOrganization<Test>>::get(owner), vec![id.clone()]);

        assert_eq!(DocumentRegistry::owner_of(&id), Some(owner));

        // Event is raised
        assert!(System::events().iter().any(|er| er.event
            == TestEvent::document_registry(RawEvent::DocumentRegistered(
            sender,
            id.clone(),
            owner
        ))));
    });
}

#[test]
fn create_document_with_invalid_origin() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::none(),
                vec!(),
                account_key(TEST_ORGANIZATION),
                None
            ),
            dispatch::DispatchError::BadOrigin
        );
    });
}

#[test]
fn create_document_with_missing_id() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                vec!(),
                account_key(TEST_ORGANIZATION),
                None
            ),
            Error::<Test>::DocumentIdMissing
        );
    });
}

#[test]
fn create_document_with_long_id() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                LONG_VALUE.as_bytes().to_owned(),
                account_key(TEST_ORGANIZATION),
                None
            ),
            Error::<Test>::DocumentIdTooLong
        );
    })
}

#[test]
fn create_document_with_existing_id() {
    new_test_ext().execute_with(|| {
        let existing_document = TEST_DOCUMENT_ID.as_bytes().to_owned();
        let now = 42;

        store_test_document::<Test>(
            existing_document.clone(),
            account_key(TEST_ORGANIZATION),
            now,
        );

        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                existing_document,
                account_key(TEST_ORGANIZATION),
                None
            ),
            Error::<Test>::DocumentIdExists
        );
    })
}

#[test]
fn create_document_with_too_many_title() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                TEST_DOCUMENT_ID.as_bytes().to_owned(),
                account_key(TEST_ORGANIZATION),
                Some(vec![
                    DocumentProperty::new(b"prop1", b"val1"),
                    DocumentProperty::new(b"prop2", b"val2")
                ])
            ),
            Error::<Test>::DocumentTooManyProps
        );
    })
}

#[test]
fn create_document_with_invalid_prop_name() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                TEST_DOCUMENT_ID.as_bytes().to_owned(),
                account_key(TEST_ORGANIZATION),
                Some(vec![
                    DocumentProperty::new(b"prop1", b"val1"),
                    DocumentProperty::new(b"prop2", b"val2"),
                    DocumentProperty::new(&LONG_VALUE.as_bytes().to_owned(), b"val3"),
                ])
            ),
            Error::<Test>::DocumentInvalidPropName
        );
    })
}

#[test]
fn create_document_with_invalid_prop_value() {
    new_test_ext().execute_with(|| {
        assert_noop!(
            DocumentRegistry::register_document(
                Origin::signed(account_key(TEST_SENDER)),
                TEST_DOCUMENT_ID.as_bytes().to_owned(),
                account_key(TEST_ORGANIZATION),
                Some(vec![
                    DocumentProperty::new(b"prop1", b"val1"),
                    DocumentProperty::new(b"prop2", b"val2"),
                    DocumentProperty::new(b"prop3", &LONG_VALUE.as_bytes().to_owned()),
                ])
            ),
            Error::<Test>::DocumentInvalidPropValue
        );
    })
}
