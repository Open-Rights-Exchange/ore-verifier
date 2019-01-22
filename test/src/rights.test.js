/* global fetch:true */
/* global RIGHTS_REGISTRY_CONTRACT_NAME:true */

const {
    getRight,
    resolveEndpoint,
    getEndpoint
} = require('../../src/rights')

const {
    orejs
} = require('../../src/ore')

const {
    mockRight,
    mockAdditionalParams,
    mockEndpointObject,
} = require('../helpers/fetch')

const {
    mockGetTableRows
} = require('../helpers/ore')

describe('getRight', () => {
    let mockedRight;

    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "rights");
    })

    it('returns the right details from the rights table in rights.ore', async () => {
        const right = await getRight("apimarket.manager.licenseApi", RIGHTS_REGISTRY_CONTRACT_NAME);
        mockedRight = await mockRight();
        expect(right).toEqual(JSON.parse(mockedRight[0]));
    });

    it('returns null if the right does not exist', async () => {
        const right = await getRight("apimarket.manager.nonExistingRight", RIGHTS_REGISTRY_CONTRACT_NAME);
        expect(right).toBeNull;
    })
})

describe('getEndpoint', () => {
    let mockedEndpoint;

    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "rights");
        mockedEndpoint = await mockEndpointObject();
    })
    it('returns the endpoint for the passed in additional_url_params', async () => {
        const endpoint = await getEndpoint("apimarket.manager.licenseApi", mockAdditionalParams("default"), RIGHTS_REGISTRY_CONTRACT_NAME);
        expect(endpoint).toEqual(JSON.parse(mockedEndpoint[0]));
    });

    it('no endpoint present for the passed in additional_url_params; returns the default endpoint', async () => {
        const endpoint = await getEndpoint("apimarket.manager.licenseApi", mockAdditionalParams("custom"), RIGHTS_REGISTRY_CONTRACT_NAME);
        expect(endpoint).toEqual(JSON.parse(mockedEndpoint[0]));
    });

    it('no aditional_url_params present in the instrument', async () => {
        const endpoint = await getEndpoint("apimarket.manager.licenseApi", mockAdditionalParams(), RIGHTS_REGISTRY_CONTRACT_NAME);
        expect(endpoint).toEqual(JSON.parse(mockedEndpoint[0]));
    });
})

describe('resolveEndpoint', () => {

    beforeEach(async () => {
        fetch.resetMocks();
        const mockedEndpoint = await mockEndpointObject();
        fetch.mockResponse(mockedEndpoint);
    })

    it('returns the url object by recursively resolving the base right', async () => {

    })
    it('returns the url object if the base right is empty', async () => {})
})