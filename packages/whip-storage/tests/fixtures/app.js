import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import { create } from '@generates/whip'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import storage from '../../index.js'

const Bucket = 'whip'
const fileUrl = new URL('josh-duncan-trunk-bay.jpg', import.meta.url)
const app = create()

app.add({
  plugin: storage,
  opts: {
    region: 'us-east-1',
    forcePathStyle: true,
    endpoint: 'http://localhost:9000',
    credentials: { accessKeyId: 'whip', secretAccessKey: 'dontWasteNoTime' }
  }
})

let Key
app.get('/', async function download (req, res) {
  if (Key) {
    const out = await req.storage.send(new GetObjectCommand({ Bucket, Key }))
    // TODO:
    // req.logger.info('GetObjectCommand response', out)
    res.set('Content-Type', 'image/jpeg').send(out.Body)
  } else {
    Key = nanoid()
    const Body = await fs.readFile(fileUrl)
    const command = new PutObjectCommand({ Bucket, Key, Body })
    const out = await req.storage.send(command)
    req.logger.info('PutObjectCommand response', out)
    res.send('File uploaded')
  }
})

export default app
