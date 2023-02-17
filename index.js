const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

app.use(express.json())
const dbUrl = 'mongodb://localhost:27017'
const client = new MongoClient(dbUrl)

// creating new mentor
app.post('/createMentor', async (req, res) => {
    try {
        let connection = await client.connect()
        let db =  connection.db('Student_Mentor_Management')
        let collection =  db.collection('mentorData')
        let mentor = await collection.findOne({ mentorName: req.body.mentorName, mentorQualification: req.body.mentorQualification })
        if (!mentor) {
            let mentorData = await collection.insertOne(req.body)
            res.status(201).send({ message: 'New mentor created', data: mentorData })
        }
        else {
            res.status(400).send({ message: 'Mentor with this data already exist' })
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(5000, () => console.log(`App is listening to 5000`))