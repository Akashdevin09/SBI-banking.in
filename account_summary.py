#!/usr/bin/env python3
"""
Demo Python script to print account summary for sample accounts.
"""
import argparse
import sys

MOCK_ACCOUNTS = {
    "1234567890": {
        "dob": "1990-01-15",
        "name": "Rahul Sharma",
        "accountType": "Savings",
        "ifsc": "SBIN0001234",
        "branch": "Mumbai Main",
        "balance": 150000.5,
        "currency": "INR",
        "lastUpdated": "2025-10-25",
        "transactions": [
            {"date": "2025-10-24", "description": "Salary Credit", "amount": 85000, "type": "credit"},
            {"date": "2025-10-22", "description": "UPI: Groceries", "amount": 2450, "type": "debit"},
            {"date": "2025-10-20", "description": "ATM Withdrawal", "amount": 6000, "type": "debit"},
            {"date": "2025-10-18", "description": "Interest Credit", "amount": 325, "type": "credit"},
            {"date": "2025-10-16", "description": "Electricity Bill", "amount": 1700, "type": "debit"},
        ],
    },
    "9876543210": {
        "dob": "1985-07-21",
        "name": "Priya Iyer",
        "accountType": "Current",
        "ifsc": "SBIN0005678",
        "branch": "Chennai Adyar",
        "balance": 42500.75,
        "currency": "INR",
        "lastUpdated": "2025-10-25",
        "transactions": [
            {"date": "2025-10-23", "description": "POS: Restaurant", "amount": 2150, "type": "debit"},
            {"date": "2025-10-22", "description": "UPI: Client Payment", "amount": 30000, "type": "credit"},
            {"date": "2025-10-20", "description": "Fuel", "amount": 1500, "type": "debit"},
            {"date": "2025-10-19", "description": "POS: Pharmacy", "amount": 850, "type": "debit"},
            {"date": "2025-10-17", "description": "NEFT Fee", "amount": 15, "type": "debit"},
        ],
    },
}

def format_inr(amount: float) -> str:
    return f"₹{amount:,.2f}"

def main(argv=None):
    parser = argparse.ArgumentParser(description="Demo account summary printer")
    parser.add_argument("--account", required=True, help="Account number (8–16 digits)")
    parser.add_argument("--dob", required=True, help="Date of Birth in yyyy-mm-dd")
    args = parser.parse_args(argv)

    acc = "".join(ch for ch in args.account if ch.isdigit())
    if not (8 <= len(acc) <= 16):
        print("Error: account must be 8–16 digits.")
        return 2

    rec = MOCK_ACCOUNTS.get(acc)
    if rec is None:
        print("No demo record found for this account number.")
        return 1

    if rec["dob"] != args.dob:
        print("DOB does not match our demo records.")
        return 1

    print("=== Account Summary ===")
    print(f"Account Holder : {rec['name']}")
    print(f"Account Number : {acc}")
    print(f"Account Type   : {rec['accountType']}")
    print(f"Branch (IFSC)  : {rec['branch']} ({rec['ifsc']})")
    print(f"Balance        : {format_inr(rec['balance'])}")
    print(f"Last Updated   : {rec['lastUpdated']}")
    print()
    print("Recent Transactions:")
    for t in rec["transactions"]:
        sign = "+" if t["type"] == "credit" else "-"
        print(f"- {t['date']} | {t['description']:<20} | {t['type']:<6} | {sign}{format_inr(t['amount'])}")

    return 0

if __name__ == "__main__":
    sys.exit(main())