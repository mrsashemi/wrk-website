const path = require('path');
const request = require('supertest');
const app = require('../server');
const spriteJSON = require('./assets/spritesheet.json')

describe('Backend Requests', () => {
    jest.setTimeout(60000)
    let res: any;
    let art: any;
    let photoOg: any;
    let photoEdit: any;
    let sketch: any;
    let sprite: any;
    let all: any;
    let one: any;
    let update: any;

    it('Processes image into various resolutions, Uploads it to S3 and creates a new entry in original images metadata table', async () => {
        const img = path.resolve(__dirname, `./assets/hasibwide.JPG`);
        
        res = await request(app)
            .post('/img/save-image')    
            .attach('image', img)
            .expect(200)

        return res;
    })

    it('saves new artwork metadata in the artworks collection', async () => {
        const img = {
            description: "test description",
            title: "Artwork Test",
            artists: ["Hasib Hashemi"],
            type: "artworks",
            resolutions: {
                res_320: res._body.img.resolutions.res_320,
                res_640: res._body.img.resolutions.res_640,
                res_768: res._body.img.resolutions.res_768,
                res_1024: res._body.img.resolutions.res_1024,
                res_1280: res._body.img.resolutions.res_1280,
                res_1536: res._body.img.resolutions.res_1536,
            }, 
            details: [
                {
                    res_320: res._body.img.resolutions.res_320,
                    res_640: res._body.img.resolutions.res_640,
                    res_768: res._body.img.resolutions.res_768,
                    res_1024: res._body.img.resolutions.res_1024,
                    res_1280: res._body.img.resolutions.res_1280,
                    res_1536: res._body.img.resolutions.res_1536,
                },
            ],
            name: res._body.img.name
        }

        art = await request(app)
            .post('/img/save-artwork')
            .send(img)
            .expect(200)

        return art
    })

    it('saves new photo metadata in the photos collection', async () => {
        const img = {
            description: "test description",
            title: "Photo Test",
            photographers: ["Hasib Hashemi"],
            type: "photographs",
            resolutions: {
                res_320: res._body.img.resolutions.res_320,
                res_640: res._body.img.resolutions.res_640,
                res_768: res._body.img.resolutions.res_768,
                res_1024: res._body.img.resolutions.res_1024,
                res_1280: res._body.img.resolutions.res_1280,
                res_1536: res._body.img.resolutions.res_1536,
            }, 
            name: res._body.img.name
        }

        photoOg = await request(app)
            .post('/img/save-photo')
            .send(img)
            .expect(200)

        return photoOg
    })

    it('Processes an edited image, uploads it to S3 and creates a new entry in the photo metadata table', async () => {
        const edit = path.resolve(__dirname, `./assets/testy.png`);
        const img = {
            description: "test description",
            title: "Photo Test",
            photographers: ["Hasib Hashemi"],
            type: "photographs",
            resolutions: {
                res_320: res._body.img.resolutions.res_320,
                res_640: res._body.img.resolutions.res_640,
                res_768: res._body.img.resolutions.res_768,
                res_1024: res._body.img.resolutions.res_1024,
                res_1280: res._body.img.resolutions.res_1280,
                res_1536: res._body.img.resolutions.res_1536,
            }, 
            name: res._body.img.name
        }

        photoEdit = await request(app)
            .post('/img/save-photo')
            .field('description', "test description")
            .field('title', "test title")
            .field("photographers", 'Hasib Hashemi')
            .field("type", "photographs")
            .field('details', JSON.stringify(img.resolutions))
            .field('name', JSON.stringify(img.name))
            .attach('image', edit)
            .expect(200)

        return photoEdit
    })

    it('Processes a new sketch, uploads it to S3 and creates a new entry in the sketch metadata table', async () => {
        const edit = path.resolve(__dirname, `./assets/testy.png`);
        const img = {
            description: "test description",
            title: "Sketch Test",
            photographers: ["Hasib Hashemi"],
            type: "photographs",
            resolutions: {
                res_320: res._body.img.resolutions.res_320,
                res_640: res._body.img.resolutions.res_640,
                res_768: res._body.img.resolutions.res_768,
                res_1024: res._body.img.resolutions.res_1024,
                res_1280: res._body.img.resolutions.res_1280,
                res_1536: res._body.img.resolutions.res_1536,
            }, 
            name: res._body.img.name
        }

        sketch = await request(app)
            .post('/img/save-sketch')
            .field('description', "test description")
            .field('title', "test title")
            .field("programmers", 'Hasib Hashemi')
            .field("type", "sketches")
            .field('source', JSON.stringify(img.resolutions))
            .field('name', JSON.stringify(img.name))
            .attach('image', edit)
            .expect(200)

        return sketch
    })

    it('Uploads a spritesheet to s3 and saves metadata to sketch table', async () => {
        const sprites = path.resolve(__dirname, `./assets/spritesheet.png`);

        sprite = await request(app)
            .post('/img/save-sprites')
            .field('sprite_frames', JSON.stringify(spriteJSON))
            .field('description', 'sprites')
            .field('title', 'spritesheet')
            .field('element', 'chickens')
            .attach('image', sprites)
            .expect(200)

        return sprite
    })


    it('Retrieves all images', async () => {
        all = await request(app)
            .get('/img/all-images')
            .send({type: 'originals'})
            .expect(200)

        return all
    })

    it('Retrieves a single image', async () => {
        one = await request(app)
            .get(`/img/single-image/${art._body.img._id}`)
            .send({type: "artworks"})
            .expect(200)

        return one
    })

    it('Can update a single image', async () => {
        update = await request(app)
            .patch(`/img/update-image/${art._body.img._id}`)
            .send({type: "artworks", description: "updated description test"})
            .expect(200)

        return update
    })


})