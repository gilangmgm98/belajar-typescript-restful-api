import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { UserTest } from "./test-util"
import bcrypt from "bcrypt";

describe('POST /api/users', () => {

    afterAll(async () => {
        await UserTest.delete()
    })

    it('should reject register new user if request is invalid', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: '',
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject register new user if username is empty', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: 'test',
                name: 'test',
            })

        logger.debug(response.body)
        const parsedErrors = JSON.parse(response.body.errors);
        // console.info(response.body)
        expect(response.status).toBe(400)
        expect(parsedErrors).toBeDefined()
        expect(parsedErrors[0].message).toBe('username must not blank')
    })

    it('should register new user', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                name: 'test',
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        // expect(response.body.data.id).toBeDefined()
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
    })

    it('should reject register new user if username already registered', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                name: 'test',
            })

        // console.info(response.body)
        const error = response.body.errors
        expect(response.status).toBe(400)
        expect(error).toBe('username already registered')
    })
})

describe('POST /api/users/login', () => {

    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to login', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'test',
            })

        // console.info(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
        expect(response.body.data.token).toBeDefined()
    })

    it('should be reject to login if username incorrect', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test123',
                password: 'test',
            })

        // console.info(response)
        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe('wrong username or password')
    })

    it('should be reject to login if password incorrect', async () => {
        const response = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'test123',
            })

        // console.info(response)
        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe('wrong username or password')
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to get current user', async () => {
        const response = await supertest(web)
            .get('/api/users/current')
            .set('X-API-TOKEN', 'test')

        // console.info(response)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe('test')
        expect(response.body.data.name).toBe('test')
    })

    it('should be reject to get current user if token invalid', async () => {
        const response = await supertest(web)
            .get('/api/users/current')
            .set('X-API-TOKEN', 'invalid')

        // console.info(response)
        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe('Unauthorized')
        expect(response.body.data).toBeUndefined()
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to update current user', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                name: 'updated test',
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.message).toBe('Update User Successfully')
        expect(response.body.data.success).toBe(true)
        expect(response.body.errors).toBeUndefined()
    })

    it('should be reject to update current user', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                name: 'up',
            })

        logger.debug(response.body)
        const parsedErrors = JSON.parse(response.body.errors);
        expect(response.status).toBe(400)
        expect(parsedErrors[0].message).toBe('name must more than 3 character')
    })


    it('should be reject to update current user if token invalid', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'Invalid Token')
            .send({
                name: 'test Ganti Nama',
            })
        // logger.debug(response.body)  
        // console.info(response.body)
        // const parsedErrors = JSON.parse(response.body.errors);
        expect(response.status).toBe(401)
        expect(response.body.errors).toBe('Unauthorized')
        expect(response.body.data).toBeUndefined()
        expect(response.body.errors).toBeDefined()
    })

    it('should be able to update user password', async () => {
        const response = await supertest(web)
            .patch('/api/users/current')
            .set('X-API-TOKEN', 'test')
            .send({
                password: 'newtest',
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)

        const user = await UserTest.get();
        expect(await bcrypt.compare('newtest', user.password)).toBe(true)
        expect(response.body.data.message).toBe('Update User Successfully')
    })
})

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to logout user', async () => {
        const response = await supertest(web)
            .delete('/api/users/current')
            .set('X-API-TOKEN', 'test')

             // console.info(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.message).toBe('User Logged Out Successfully')
        expect(response.body.data.success).toBe(true)

        const user = await UserTest.get()
        expect(user.token).toBeNull()
    })
    
    it('should be reject to logout user if token invalid', async () => {
        const response = await supertest(web)
            .delete('/api/users/current')
            .set('X-API-TOKEN', 'invalid token')

             // console.info(response.body)
        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.data).toBeUndefined()
        expect(response.body.errors).toBe('Unauthorized')
        expect(response.body.errors).toBeDefined()
    })
})

