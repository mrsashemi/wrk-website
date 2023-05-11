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
    let deletes: any = {};

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
            resolutions: res._body.img.resolutions, 
            details: [
                res._body.img.resolutions,
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
            resolutions: res._body.img.resolutions, 
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
            resolutions: res._body.img.resolutions, 
            name: res._body.img.name
        }

        photoEdit = await request(app)
            .post('/img/save-photo')
            .field('description', "test description")
            .field('title', "test title")
            .field("photographers", 'Hasib Hashemi')
            .field("type", "photographs")
            .field('details', JSON.stringify(img.resolutions))
            .field('name', img.name)
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
            resolutions: res._body.img.resolutions, 
            name: res._body.img.name
        }

        sketch = await request(app)
            .post('/img/save-sketch')
            .field('description', "test description")
            .field('title', "test title")
            .field("programmers", 'Hasib Hashemi')
            .field("type", "sketches")
            .field('source', JSON.stringify(img.resolutions))
            .field('name', img.name)
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
            .get('/img/all-images/originals')
            .expect(200)

        return all
    })

    it('Retrieves a single image', async () => {
        let artwork = {
            id: art._body.img._id,
            type: 'artworks'
        }

        let urlParam = encodeURIComponent(JSON.stringify(artwork))

        one = await request(app)
            .get(`/img/single-image/${urlParam}`)
            .send({type: "artworks"})
            .expect(200)

        return one
    })

    it('Can update a single image', async () => {
        let artwork = {
            id: art._body.img._id,
            type: 'artworks'
        }

        let urlParam = encodeURIComponent(JSON.stringify(artwork))

        update = await request(app)
            .patch(`/img/update-image/${urlParam}`)
            .send({description: "updated description test"})
            .expect(200)

        return update
    })

    it('Can delete metadata and s3 objects', async () => {
        let originals = {
            id: res._body.img._id,
            type: 'originals',
            toDelete: res._body.img.resolutions
        }

        deletes.og = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(originals))}`)
            .expect(200)

        let artwork = {
            id: art._body.img._id,
            type: 'artworks'
        }

        deletes.arts = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(artwork))}`)
            .expect(200)

        let ogPhoto = {
            id: photoOg._body.img._id,
            type: 'photographs'
        }

        deletes.ogPic = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(ogPhoto))}`)
            .expect(200)

        let editPhoto = {
            id: photoEdit._body.img._id,
            type: 'photographs',
            toDelete: photoEdit._body.img.resolutions
        }

        deletes.editPic = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(editPhoto))}`)
            .expect(200)

        let generative = {
            id: sketch._body.img._id,
            type: 'sketches',
            toDelete: sketch._body.img.resolutions
        }

        deletes.genSketch = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(generative))}`)
            .expect(200)

        let spritesheet = {
            id: sprite._body.img._id,
            type: 'sprites',
            toDelete: {
                sprites: sprite._body.img.sprites
            }
        }

        deletes.sheet = await request(app)
            .delete(`/img/delete-image/${encodeURIComponent(JSON.stringify(spritesheet))}`)
            .expect(200)
        
        return deletes
    })


})
