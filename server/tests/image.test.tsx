const path = require('path');
const request = require('supertest');
const app = require('../server');


describe('Create Requests', () => {
    jest.setTimeout(60000)

    it('Uploads an image to S3 and creates a new entry in original images metadata table', async () => {
        const img = path.resolve(__dirname, `./assets/hasibwide.JPG`);
        
        return await request(app)
            .post('/img/save-image')    
            .attach('image', img)
            .expect(200)
    })

})

