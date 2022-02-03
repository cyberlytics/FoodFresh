import argparse
import csv
import sys
from substrateinterface import SubstrateInterface, Keypair

# Accounts
alice = Keypair.create_from_uri('//Alice')
bob = Keypair.create_from_uri('//Bob')
charlie = Keypair.create_from_uri('//Charlie')


def get_para_address(instance, paraid, prefix=b'para'):
    """
    Returns parachain address in ss58 format.
    b'para' + encoded(parachain id ) + 00...00 up to 32 bytes.

    :param instance: substrate connection instance
    :param paraid:   parachain id
    :param prefix:   'para' - parachain address in parent (relay) chain
                     'sibl' - parachain address in other (sibling) chain
    """

    addr = bytearray(prefix)
    addr.append(paraid & 0xFF)
    paraid = paraid >> 8
    addr.append(paraid & 0xFF)
    paraid = paraid >> 8
    addr.append(paraid & 0xFF)

    return instance.ss58_encode(addr.ljust(32, b'\0'))


def hrmp_open(app, source_parachain, target_parachain):
    """
    Open HRMP channel between two parachains.

    :param target_parachain: Target parachain
    :param source_parachain: Source parachain
    :param app:              Substrate connection instance
    """
    assert source_parachain != target_parachain

    # establish HRMP channel
    payload = app.compose_call(
        call_module='ParasSudoWrapper',
        call_function='sudo_establish_hrmp_channel',
        call_params={
            'sender': source_parachain,
            'recipient': target_parachain,
            'max_capacity': 5,
            'max_message_size': 500,
        }
    )

    # compose call for extrinsic
    call = app.compose_call(
        call_module='Sudo',
        call_function='sudo',
        call_params={
            'call': payload.value,
        }
    )

    # submit extrinsic
    extrinsic = app.create_signed_extrinsic(call=call, keypair=alice)
    app.submit_extrinsic(extrinsic, wait_for_inclusion=True)


def ump(instance, message, call_module='TemplateModule', call_function='send_relay_chain'):
    """
    Send upward message to relay chain.

    :param instance: Substrate connection instance
    :param message: Upward message
    :param call_module: Module to call
    :param call_function: Function to call
    """

    call = instance.compose_call(
        call_module=call_module,
        call_function=call_function,
        call_params={
            'call': message
        }
    )

    extrinsic = instance.create_signed_extrinsic(call=call, keypair=bob)
    instance.submit_extrinsic(extrinsic, wait_for_inclusion=True)


def hrmp(instance, paraid, message, call_module='TemplateModule', call_function='send_para_chain'):
    """
    Passing xcm (hrmp) message to a target parachain.

    :param paraid: Target parachain id
    :param message: XCM message
    :param call_function: Function to call
    :param call_module: Module to call
    :param instance: Substrate connection instance
    """

    call = instance.compose_call(
        call_module=call_module,
        call_function=call_function,
        call_params={
            'paraid': paraid,
            'call': message
        }
    )

    extrinsic = instance.create_signed_extrinsic(call=call, keypair=bob)
    instance.submit_extrinsic(extrinsic, wait_for_inclusion=True)


def extract_extrinsics_data(block_hash):
    """
    Extract extrinsics from block

    :param block_hash: The corresponding block hash to extract extrinsics
    """

    block_body = substrate.get_block(block_hash=block_hash)
    extrinsics = []

    for extrinsic in block_body['extrinsics']:
        if 'address' in extrinsic.value:
            signed_by_address = extrinsic.value['address']
        else:
            signed_by_address = None

        print('\nPallet: {}\nCall: {}\nSigned by: {}'.format(
            extrinsic.value["call"]["call_module"],
            extrinsic.value["call"]["call_function"],
            signed_by_address
        ))

        # Loop through call params
        for param in extrinsic.value["call"]['call_args']:
            if param['type'] == 'Balance':
                param['value'] = '{} {}'.format(param['value'] / 10 ** substrate.token_decimals, substrate.token_symbol)
            else:
                param['value'] = 1

            extrinsics.append("{}, {}, {}".format(signed_by_address, param['name'], param['value']))

        return extrinsics


def subscription_handler(obj, update_nr, subscription_id):
    """
    Writes extrinsics data to file.
    """

    print(f"New block #{obj['header']['number']} with extrinsics {obj['header']['parentHash']}")
    extrinsics_data = extract_extrinsics_data(obj['header']['parentHash'])
    with open('output.csv', 'w') as f:
        write = csv.writer(f)
        write.writerow(['sender', 'name', 'value'])
        write.writerows(extrinsics_data)


def monitor(instance):
    instance.subscribe_block_headers(subscription_handler)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='XCM CLI')
    parser.add_argument('command', help='ump hrmp monitor')
    parser.add_argument('--ws_url', help='websocker url', nargs='*', default=['ws://localhost:9944/'])
    parser.add_argument('--amount', help='amount', type=int, default=10_000_000_000_000)
    parser.add_argument('--paraid', help='parachain id', nargs='*', type=int, default=[2000])
    parser.add_argument('--account', help='account uri (i.e  //Alice)', type=str, default='//Alice')
    args = parser.parse_args()

    url = args.ws_url[0]
    print(f"connect to node via {url}")
    cmd = args.command
    dev = Keypair.create_from_uri(args.dev)

    substrate = SubstrateInterface(
        url=url,
        ss58_format=42,
        type_registry_preset='rococo',
    )
    substrate.update_type_registry_presets()

    if cmd == "hrmp_open":
        if len(args.paraid) != 2:
            sys.exit(1)
        hrmp_open(substrate, args.paraid[0], args.paraid[1])

    elif cmd == "ump":
        if len(sys.argv) == 4:
            msg = open(sys.argv[3]).read()
        else:
            msg = '0x0'
        ump(substrate, msg)

    elif cmd == "hrmp":
        if len(sys.argv) == 5:
            msg = open(sys.argv[4]).read()
        else:
            msg = '0x0'
        hrmp(substrate, args.paraid[0], msg)

    elif cmd == "monitor":
        monitor(substrate)

    else:
        print(f"unknown command '{cmd}'")
