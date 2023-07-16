const badModel = {
  _id: '123',
  symbol: 'NGN',
  user: '1',
  balance: 1000000,
  enabled: true,
};

// user asset
const userAsset = {
  _id: '123',
  symbol: 'NGN',
  user: '1',
  withdrawalActivity: 'ACTIVE', // ACTIVE, SUSPENDED, BLOCKED
  depositActivity: 'SUSPENDED',
}

const transaction = {
  "_id": "296c9733-f794-4f67-b994-453bd8ab51f5",
  "symbol": "USDT",
  "amount": 150,
  "fee": 0,
  "totalAmount": 150,
  "userId": "fb6d6a6e-4345-4d42-923a-0e97e0794106",
  "assetId": "9d3070ff-e514-42c8-b437-1932956e7983",
  "clerkType": "CREDIT",
  "type": "ADMIN_CREDIT",
  "reasonId": "From Admin",
  "status": "SUCCESSFUL",
  "createdAt": {
    "$date": "2023-02-05T03:45:02.330Z"
  },
  "updatedAt": {
    "$date": "2023-02-05T03:45:02.330Z"
  },
  "__v": 0
};
