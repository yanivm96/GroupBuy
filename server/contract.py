from web3 import Web3


user_name = "GroupBuy"
api_key = "GroupBuyMTA"
api_key_secret = "c6cfbe100d524d0bbbbb7a9cded0e682"


ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
print("-----------------test--------------")
print(web3.isConnected())

print(web3.eth.blockNumber)

balance = web3.eth.getBalance("0x39C7BC5496f4eaaa1fF75d88E079C22f0519E7b9")
print(web3.fromWei(balance, "ether"))
print("-----------------test--------------")


from web3 import Web3
from web3.middleware import geth_poa_middleware

# Connect to the local Ethereum node
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# Load the smart contract ABI and address
abi = [...]  # insert the ABI here
address = '0x...'  # insert the contract address here
contract = w3.eth.contract(address=address, abi=abi)

# Cancel the purchase
account = '0x...'  # insert your Ethereum account address here
tx_hash = contract.functions.cancel().transact({'from': account})
receipt = w3.eth.waitForTransactionReceipt(tx_hash)
