import supertest from 'supertest'
import { ContactTest, UserTest } from './test-util'
import { web } from "../src/application/web";
import { logger } from '../src/application/logging';

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it("should create new contacts", async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@test.com',
                phone: '081234567890'
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.first_name).toBe('test')
        expect(response.body.data.last_name).toBe('test')
        expect(response.body.data.email).toBe('test@test.com')
        expect(response.body.data.phone).toBe('081234567890')
    })

    it("should reject create new contacts unauthorized", async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('X-API-TOKEN', 'invalid token')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@test.com',
                phone: '081234567890'
            })

        logger.debug(response.body)
        // const errorParsed = JSON.parse(response.body.errors)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe('Unauthorized')
    })

    it('should reject create new contact if data is invalid', async () => {
        const response = await supertest(web)
            .post('/api/contacts')
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: 'test',
                email: 'test@test.com',
                phone: '081234567890'
            })

        logger.debug(response.body)

        const errorParsed = JSON.parse(response.body.errors)
        expect(response.status).toBe(400)
        expect(errorParsed).toBeDefined()
        expect(errorParsed[0].message).toBe('first_name must not be empty')
    })
})

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
    })

    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it("should get contact by id", async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test')
            
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.first_name).toBe(contact.first_name)
        expect(response.body.data.last_name).toBe(contact.last_name)
        expect(response.body.data.email).toBe(contact.email)
        expect(response.body.data.phone).toBe(contact.phone)

    })

    it("should get contact by id", async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id+2}`)
            .set('X-API-TOKEN', 'test')
            
        logger.debug(response)
        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toBe('Contact not found')
    })
})

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
    })

    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to update contact', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: 'Gilang test',
                last_name: 'Murdiyanto test',
                email: 'updated@test.com',
                phone: '081234567891'
            })

            logger.debug(response.body)
            expect(response.status).toBe(200)
            expect(response.body.data.id).toBe(contact.id)
            expect(response.body.data.first_name).toBe('Gilang test')
            expect(response.body.data.last_name).toBe('Murdiyanto test')
            expect(response.body.data.email).toBe('updated@test.com')
            expect(response.body.data.phone).toBe('081234567891')
            
    })

    it('should reject to update contact if request invalid', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                first_name: '',
                last_name: 'Murdiyanto test',
                email: 'test.com',
                phone: '081'
            })

            logger.debug(response.body)
            expect(response.body.data).toBeUndefined()
            expect(response.status).toBe(400)
            expect(response.body.errors).toBeDefined()
    })

    it('should reject to update contact if unauthorized', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'invalid token')
            .send({
                first_name: '',
                last_name: 'Murdiyanto test',
                email: 'test.com',
                phone: '081'
            })

            logger.debug(response.body)
            expect(response.body.data).toBeUndefined()
            expect(response.status).toBe(401)
            expect(response.body.errors).toBe('Unauthorized')
    })
})

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create()
        await ContactTest.create()
    })
    
    afterEach(async () => {
        await ContactTest.deleteAll()
        await UserTest.delete()
    })

    it('should be able to delete contact', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'test')
            
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe('Remove Contact Successfully')
        expect(response.body.errors).toBeUndefined()
        
    })

    it('should be reject to delete contact if invalid token', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set('X-API-TOKEN', 'invalid token')
            
        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.data).toBeUndefined()
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toBe('Unauthorized')   
    })

    it('should be reject to delete contact if contactId Invalid', async () => {
        const contact = await ContactTest.get()
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id+3}`)
            .set('X-API-TOKEN', 'test')
            
        logger.debug(response.body)
        expect(response.status).toBe(404)
        expect(response.body.data).toBeUndefined()
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toBe('Contact not found')   
    })
})