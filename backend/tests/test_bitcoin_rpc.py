from app.bitcoin.rpc import amount_to_sats


def test_amount_to_sats():
    assert amount_to_sats("0.10000000") == 10_000_000
    assert amount_to_sats(1) == 100_000_000
