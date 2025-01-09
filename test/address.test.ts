import supertest from 'supertest'
import { UserTest, ContactTest, AddressTest } from './test-util'
import { web } from '../src/application/web'
import { logger } from '../src/application/logging'

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
    })

    afterEach(async () => {
        await AddressTest.deleteAll()
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to create addresses', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau',
                city: 'Gatau City',
                province: 'Bagian mana',
                country: 'Indonesia',
                postal_code: '123'
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe('Jalan belum tau');
        expect(response.body.data.city).toBe('Gatau City');
        expect(response.body.data.province).toBe('Bagian mana');
        expect(response.body.data.country).toBe('Indonesia');
        expect(response.body.data.postal_code).toBe('123');
    })

    it('should reject create new address if request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau',
                city: 'Gatau City',
                province: 'Bagian mana',
                country: 'Indonesia',
                postal_code: ''
            })

        logger.debug(response.body);
        const errParsed = JSON.parse(response.body.errors)
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(errParsed[0].message).toBe('Postal Code is required');
    })

    it('should reject create new address if contact not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id + 3}/addresses`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau',
                city: 'Gatau City',
                province: 'Bagian mana',
                country: 'Indonesia',
                postal_code: '123'
            })

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe('Contact not found');
    })

    it('should reject create new address if unauthorized', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('X-API-TOKEN', 'invalid token')
            .send({
                street: 'Jalan belum tau',
                city: 'Gatau City',
                province: 'Bagian mana',
                country: 'Indonesia',
                postal_code: '123'
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.data).toBeUndefined();
        expect(response.body.errors).toBe('Unauthorized');
    })

})

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
    })

    afterEach(async () => {
        await AddressTest.deleteAll()
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to get address by id', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe(address.country);
        expect(response.body.data.postal_code).toBe(address.postal_code);
    })

    it('should reject get address by id if address not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 4}`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject get address by id if contact not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 4}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject get address by id if unauthorized', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 4}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'invalid token')


        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe('Unauthorized');
    })

})

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
    })

    afterEach(async () => {
        await AddressTest.deleteAll()
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to update address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau baru',
                city: 'Gatau City baru',
                province: 'Bagian mana baru',
                country: 'Indonesia',
                postal_code: '54321'
            })


        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe('Jalan belum tau baru');
        expect(response.body.data.city).toBe('Gatau City baru');
        expect(response.body.data.province).toBe('Bagian mana baru');
        expect(response.body.data.country).toBe('Indonesia');
        expect(response.body.data.postal_code).toBe('54321');

    })


    it('should reject to update address if invalid ', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau baru',
                city: 'Gatau City baru',
                province: 'Bagian mana baru',
                country: 'Indonesia',
                postal_code: ''
            })


        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject to update address if address not found ', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')
            .send({
                street: 'Jalan belum tau baru',
                city: 'Gatau City baru',
                province: 'Bagian mana baru',
                country: 'Indonesia',
                postal_code: '123'
            })


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe('Address not found');
    })
})

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
    })

    afterEach(async () => {
        await AddressTest.deleteAll()
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to delete address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Remove Address Successfully');
        expect(response.body.succes).toBe(true);
    })

    it('should reject to delete address if address not found ', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        const response = await supertest(web)

            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'test')

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe('Address not found');
        // expect(response.body.status).toBe(false);
    })

    it('should reject to delete address if invalid token ', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        const response = await supertest(web)

            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('X-API-TOKEN', 'invalid token')

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBe('Unauthorized');
        // expect(response.body.status).toBe(false);
    })
})

describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
        await AddressTest.create()
    })

    afterEach(async () => {
        await AddressTest.deleteAll()
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to list address', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    })

    it('should reject to list address if contact not found', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 3}/addresses/`)
            .set('X-API-TOKEN', 'test')


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBe('Contact not found');
    })
})