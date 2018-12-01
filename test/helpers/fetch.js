/* global ORE_TESTA_ACCOUNT_NAME: true */

function expectFetch(...urls) {
  expect(fetch.mock.calls.length).toEqual(urls.length);
  urls.forEach((url, i) => {
    expect(fetch.mock.calls[i][0]).toEqual(url);
  });
}

function mock(body, status = 200) {
  return [
    JSON.stringify(body),
    {
      status,
    },
  ];
}

function mockAccount(account = {}) {
  return mock([{
    account_name: 'y4dcmrzgiyte',
    cpu_limit: {
      available: 12342451,
      max: 12342451,
      used: 0,
    },
    cpu_weight: 10000,
    created: '2018-07-27T05:08:50.500',
    head_block_num: 925723,
    head_block_time: '2018-08-01T12:42:12.000',
    last_code_update: '1970-01-01T00:00:00.000',
    net_limit: {
      available: 64709992,
      max: 64709992,
      used: 0,
    },
    net_weight: 10000,
    permissions: [{
        parent: 'owner',
        perm_name: 'active',
        required_auth: {
          accounts: [],
          keys: [{
            key: 'EOS5QygD8vsKRXuVR8JMgLPjWwqzUyVGAJyvYaK7ffU4oPDmgwgqX',
            weight: 1,
          }],
          threshold: 1,
          waits: [],
        },
      },
      {
        parent: '',
        perm_name: 'owner',
        required_auth: {
          accounts: [],
          keys: [{
            key: 'EOS7xvHh4RwHJhMYXQE8r3d6AkVpxYUQEiopQi5jM1q1JYRyJZZzX',
            weight: 1,
          }],
          threshold: 1,
          waits: [],
        },
      },
    ],
    privileged: false,
    ram_quota: 8150,
    ram_usage: 2996,
    refund_request: null,
    self_delegated_bandwidth: null,
    total_resources: {
      cpu_weight: '1.0000 SYS',
      net_weight: '1.0000 SYS',
      owner: 'y4dcmrzgiyte',
      ram_bytes: 8150,
    },
    voter_info: null,
    ...account,
  }]);
}

function mockBlock(block = {}) {
  return mock([{
    timestamp: '2018-07-30T14:24:24.000',
    producer: 'eosio',
    confirmed: 0,
    previous: '00090a02e194bf83b406638a2165c69abdb6524aab0e0d9323e5788871501af9',
    transaction_mroot: '0000000000000000000000000000000000000000000000000000000000000000',
    action_mroot: 'b6ad4c65a79b1b43d223cfcbe3445b40e6fbd308a769fd8db9eed7404ecf2df7',
    schedule_version: 0,
    new_producers: null,
    header_extensions: [],
    producer_signature: 'SIG_K1_KbGoYqtV83Y7FeJ72sNNvmW7o3AMEMVug9HFPDovYTS6gZGERMdUs8neva44nMHB7qnUeSGn8A6PcuvZ9GR6mStChzMSD5',
    transactions: [],
    block_extensions: [],
    id: '00090a0384aa271b99b94d25a3d069c4387625e972d05c21ffa17180d1f09ec2',
    block_num: 592387,
    ref_block_prefix: 625850777,
    ...block,
  }]);
}

function mockCode() {
  return '';
}

function mockError(error = {}) {
  return new Error({
    code: 500,
    message: 'Internal Service Error',
    error: {
      code: 3100002,
      name: 'unknown_block_exception',
      what: 'Unknown block',
      details: [],
      ...error,
    },
  });
}

function mockInstrument(instrument = {}) {
  const innerInstrument = {
    issuer: 'aikon.apim',
    instrument_class: 'apimarket.apiVoucher',
    description: 'process an image and returns the list of objects found',
    instrument_template: '',
    security_type: 'pass',
    parameter_rules: [{
      "type": "required",
      "values": [{
        "name": "appId",
        "value": ""
      }]
    }, {
      "type": "locked",
      "values": [{
        "name": "userAccount",
        "value": ""
      }]
    }, {
      "type": "default",
      "values": [{
        "name": "language",
        "value": "en-us"
      }]
    }],
    rights: [{
      right_name: 'apimarket.manager.licenseApi',
      description: 'creates an api voucher to access cloud.hadron.contest-2018-07',
      price_in_cpu: '0',
      additional_url_params: [{
        "params": [{
          "name": "appId",
          "value": "2"
        }, {
          "name": "userAccount",
          "value": "testAccount"
        }, {
          "name": "scope",
          "value": "name,email"
        }]
      }, {
        "params": [{
          "name": "appId",
          "value": "2"
        }, {
          "name": "userAccount",
          "value": "Rob"
        }, {
          "name": "scope",
          "value": "name,email"
        }]
      }]
    }],
    parent_instrument_id: 1,
    data: [],
    encryptedBy: "",
    mutability: 1,
    ...instrument.instrument,
  };

  return {
    id: 0,
    owner: 'app.apim',
    minted_by: 'app.apim',
    minted_at: Math.floor(Date.now() / 1000),
    revoked: 0,
    start_time: Math.floor(Date.now() / 1000) - 1,
    end_time: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expires in 30 days
    ...instrument,
    instrument: innerInstrument,
  };
}

function mockInstruments(instruments = [{}]) {
  let idx = 1;
  return mock({
    rows: instruments.map((instrument) => {
      const instr = mockInstrument({
        id: idx,
        ...instrument,
      });
      idx += 1;
      return instr;
    }),
  });
}

function mockTransaction(transaction = {}) {
  return {
    transaction_id: '0',
    ...transaction,
  };
}

function mockRight() {
  return mock({
    "id": 2328537666,
    "right_name": "apimarket.manager.licenseApi",
    "owner": "manager.apim",
    "urls": [{
      "base_right": "",
      "url": "ore://manager.apim/action/licenseapi",
      "method": "post",
      "matches_params": [{
        "name": "sla",
        "value": "default"
      }],
      "token_life_span": 100,
      "is_default": 1
    }],
    "issuer_whitelist": [
      "app.apim",
      "aikon.apim"
    ]
  });
}

function mockRights() {
  return [{
    "id": 3794930591,
    "right_name": "com.googleapis.vision.faces",
    "owner": "aikon.apim",
    "urls": [{
      "base_right": "com.googleapis",
      "url": "/vision/faces",
      "method": "get",
      "matches_params": [],
      "token_life_span": 100,
      "is_default": 1
    }],
    "issuer_whitelist": [
      "app.apim"
    ]
  }, {
    "id": 4200969723,
    "right_name": "com.googleapis",
    "owner": "aikon.apim",
    "urls": [{
      "base_right": "",
      "url": "https://googleapis-dot-partner-aikon.appspot.com",
      "method": "get",
      "matches_params": [],
      "token_life_span": 100,
      "is_default": 1
    }, {
      "base_right": "",
      "url": "http://localhost:8080",
      "method": "get",
      "matches_params": [{
        "name": "env",
        "value": "local"
      }],
      "token_life_span": 100,
      "is_default": 0
    }],
    "issuer_whitelist": [
      "app.apim"
    ]
  }];
}

function mockAdditionalParams(paramType) {
  if (paramType === "default") {
    return [{
      "name": "sla",
      "value": "default"
    }];
  } else if (paramType === "custom") {
    return [{
      "name": "sla",
      "value": "default"
    }];
  } else {
    return [];
  }
}

function mockEndpointObject() {
  return mock({
    "base_right": "",
    "is_default": 1,
    "matches_params": [{
      "name": "sla",
      "value": "default"
    }],
    "method": "post",
    "token_life_span": 100,
    "url": "ore://manager.apim/action/licenseapi"
  });
}

function mockAuthorization(_authorization = {}) {
  return {
    actor: expect.any(String),
    permission: expect.any(String),
    ..._authorization,
  };
}

function mockApprovedAccounts(quantity = "0.0000 CPU") {
  return mock({
    "to": "verifier.ore",
    "quantity": quantity
  });
}

function mockAccountFromKey(account = ORE_TESTA_ACCOUNT_NAME) {
  return mock({
    "account_names": [
      account
    ]
  })
}

module.exports = {
  expectFetch,
  mock,
  mockAuthorization,
  mockAccountFromKey,
  mockRight,
  mockAdditionalParams,
  mockEndpointObject,
  mockApprovedAccounts,
  mockAccount,
  mockBlock,
  mockCode,
  mockError,
  mockInstrument,
  mockInstruments,
  mockTransaction,

};