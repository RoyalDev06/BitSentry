from decimal import Decimal, ROUND_HALF_UP
import requests
from app.config import settings


class BitcoinRPCError(RuntimeError):
    pass


class BitcoinRPC:
    def __init__(self):
        self.url = settings.bitcoin_rpc_url
        self.auth = (settings.bitcoin_rpc_user, settings.bitcoin_rpc_password)

    def call(self, method: str, params: list | None = None):
        payload = {"jsonrpc": "1.0", "id": "bitsentry", "method": method, "params": params or []}
        try:
            response = requests.post(self.url, json=payload, auth=self.auth, timeout=10)
            response.raise_for_status()
            body = response.json()
        except requests.RequestException as exc:
            raise BitcoinRPCError(f"Bitcoin Core RPC request failed: {exc}") from exc
        except ValueError as exc:
            raise BitcoinRPCError("Bitcoin Core returned invalid JSON") from exc
        if body.get("error"):
            raise BitcoinRPCError(str(body["error"]))
        return body.get("result")

    def get_blockchain_info(self):
        return self.call("getblockchaininfo")

    def get_block_count(self) -> int:
        return int(self.call("getblockcount"))

    def get_block_hash(self, height: int) -> str:
        return self.call("getblockhash", [height])

    def get_block(self, block_hash: str) -> dict:
        return self.call("getblock", [block_hash, 2])

    def get_raw_transaction(self, txid: str) -> dict:
        return self.call("getrawtransaction", [txid, True])


def amount_to_sats(value) -> int:
    return int((Decimal(str(value)) * Decimal("100000000")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
