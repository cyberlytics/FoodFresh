"""
Initialization script
---
The sole purpose of the methods is to have reusable, composed calls.
They don't resemble a lib. Thus, checks of the parameter values are omitted.
"""

from datetime import datetime, timedelta
from random import randrange
from scalecodec import GenericExtrinsic
from substrateinterface import SubstrateInterface, Keypair, ExtrinsicReceipt
from uuid import uuid4, UUID

substrate = SubstrateInterface(
    url="ws://127.0.0.1:9944",
    ss58_format=42,
    type_registry_preset='substrate-node-template'
)


def generate_location() -> dict:
    """
    Generate a random geographical location.
    """
    return {
        'latitude': randrange(-180, 180),
        'longitude': randrange(-180, 180)
    }


def create_role(pallet: str, permission: str, keypair: Keypair) -> GenericExtrinsic:
    """
    Creates role with defined permission for a pallet.

    :param pallet:  Name of the pallet e.g. 'Registrar'
    :param permission:  Can be 'Execute' or 'Manage'
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='rbac',
        call_function='createRole',
        call_params={
            'pallet': pallet,
            'permission': permission
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def assign_role(address: str, permission: ExtrinsicReceipt, keypair: Keypair) -> GenericExtrinsic:
    """
    Assign role with defined permission to an address.

    :param address:     Name of the pallet e.g. 'Registrar'
    :param permission:  Can be 'Execute' or 'Manage'
    :param keypair:     Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='rbac',
        call_function='assignRole',
        call_params={
            'pallet': address,
            'permission': permission
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def create_organization(name: str, keypair: Keypair) -> GenericExtrinsic:
    """
    Create an organization.

    :param name:  Name of the organization
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='registrar',
        call_function='createOrganization',
        call_params={
            'org_name': name,
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def add_to_organization(member_address: str, keypair: Keypair) -> GenericExtrinsic:
    """
    Add a member to an organization.

    :param member_address:  Name of the pallet e.g. 'Registrar'
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='registrar',
        call_function='addToOrganization',
        call_params={
            'address': member_address,  # TODO
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def register_product(uuid: UUID, owner: str, props: list, keypair: Keypair) -> GenericExtrinsic:
    """
    Register a product.

    :param uuid:  ID of the product
    :param owner:  SS58 address of the owner
    :param props:  Properties describing the product
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='productRegistry',
        call_function='registerProduct',
        call_params={
            'id': uuid,
            'owner': owner,
            'props': props
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def register_shipment(uuid: UUID, owner: str, products: list, keypair: Keypair) -> GenericExtrinsic:
    """
    Register a shipment.

    :param uuid:  Unique shipment identifier
    :param owner:  Name of
    :param products:  List of product IDs associated with the given shipment
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='productTracking',
        call_function='registerShipment',
        call_params={
            'id': uuid,
            'owner': owner,
            'products': products
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


def track_shipment(uuid, operation: str, timestamp, location, keypair: Keypair) -> GenericExtrinsic:
    """
    Track shipping events occuring during the shipment's lifecycle.

    :param uuid:  Unique shipment identifier
    :param operation:  Business operation during the shipping process: `Pickup`, `Scan` or `Deliver`.
    :param timestamp:  UNIX time of event
    :param location:  Geographic position of the event
    :param keypair:  Keypair for extrinsic submission
    """
    call = substrate.compose_call(
        call_module='productTracking',
        call_function='registerShipment',
        call_params={
            'id': uuid,
            'operation': operation,
            'timestamp': timestamp,
            'location': location,
        }
    )
    return substrate.create_signed_extrinsic(call=call, keypair=keypair)


if __name__ == '__main__':
    # blockchain accounts
    admin = Keypair.create_from_uri('//Alice')
    bob = Keypair.create_from_uri('//Bob')
    betty = Keypair.create_from_uri('//Betty')
    charlie = Keypair.create_from_uri('//Charlie')
    dave = Keypair.create_from_uri('//Dave')
    daisy = Keypair.create_from_uri('//Daisy')

    # create roles
    execute_registrar = substrate.submit_extrinsic(create_role('Registrar', 'Execute', admin), wait_for_inclusion=True)
    execute_product_registry = substrate.submit_extrinsic(create_role('ProductRegistry', 'Execute', admin),
                                                          wait_for_inclusion=True)
    execute_product_tracking = substrate.submit_extrinsic(create_role('ProductTracking', 'Execute', admin),
                                                          wait_for_inclusion=True)
    execute_balances = substrate.submit_extrinsic(create_role('Balances', 'Execute', admin), wait_for_finalization=True)
    print("Extrinsic '{}' sent and included in block '{}'".format(execute_balances.extrinsic_hash,
                                                                  execute_balances.block_hash))

    # assign roles
    substrate.submit_extrinsic(assign_role(bob.ss58_address, execute_registrar, admin),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(assign_role(bob.ss58_address, execute_product_registry, admin),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(assign_role(bob.ss58_address, execute_product_tracking, admin),
                               wait_for_finalization=True)

    # manage organization
    substrate.submit_extrinsic(create_organization("Bob's Burgers", bob), wait_for_inclusion=True)
    substrate.submit_extrinsic(add_to_organization(bob.ss58_address, bob), wait_for_inclusion=True)

    # create products
    beef = uuid4()
    substrate.submit_extrinsic(create_organization("Bob's Burgers", bob),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(register_product(beef, bob.ss58_address, [['desc', 'beef burger']], betty),
                               wait_for_inclusion=True)
    veggie = uuid4()
    substrate.submit_extrinsic(register_product(veggie, bob.ss58_address, [['desc', 'veggie burger']], betty),
                               wait_for_inclusion=True)

    # create shipment
    bobShipment = uuid4()
    substrate.submit_extrinsic(register_shipment(bobShipment, bob.ss58_address, [beef, veggie], betty),
                               wait_for_inclusion=True)

    # tack shipment
    now = datetime.now() - timedelta(days=7)
    substrate.submit_extrinsic(track_shipment(bobShipment, 'Pickup', now, generate_location(), betty),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(track_shipment(bobShipment, 'Scan', now + timedelta(days=1), generate_location(), betty),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(track_shipment(bobShipment, 'Scan', now + timedelta(days=randrange(2, 4)), generate_location(), betty),
                               wait_for_inclusion=True)
    substrate.submit_extrinsic(track_shipment(bobShipment, 'Deliver', now + timedelta(days=randrange(4, 6)), generate_location(), betty),
                               wait_for_inclusion=True)
