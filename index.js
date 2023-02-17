const express = require('express')
const app = express()
app.use(express.json())
const port = 5000

const mongodb = require('mongodb')
const {MongoClient} = require('mongodb')
const dbName = 'Student_Mentor_Management'

const dbUrl =`mongodb+srv://rohitpujari:rohitpujari@atlascluster.mrsic9z.mongodb.net/${dbName}` 
// `mongodb://localhost:27017 `

// let mentorData = []
// let studentData = []
// let assigningStudent = []

// creating new mentor
const client = new MongoClient(dbUrl)

app.post('/createMentor', async (req, res) => {
    // await client.connect()
    try {
        let connection=await client.connect()
        console.log('connected')
        let db=connection.db(dbName)
        let collection=db.collection('mentorData')
        let mentor = await collection.findOne({ mentorName: req.body.mentorName, mentorQualification: req.body.mentorQualification })
        if (!mentor) {
            let mentorData = await collection.insertOne(req.body)
            res.status(201).send({ message: 'New mentor created', data: mentorData })
        }
        else {
            res.status(400).send({ message: 'Mentor with this data already exist' })
        }


        // console.log(req.body)
        // const db = await client.db(dbName)
        // const collection = await db.collection('mentorData')
        // let mentor = await collection.findOne({ mentorName: req.body.mentorName, mentorQualification: req.body.mentorQualification })
        // if (!mentor) {
        //     let mentorData = await collection.insertOne(req.body)
        //     res.status(201).send({ message: 'New mentor created', data: mentorData })
        // }
        // else {
        //     res.status(400).send({ message: 'Mentor with this data already exist' })
        // }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
    // if (req.body.mentorName && req.body.mentorQualification && req.body.mentorId) {
    //     let mentor = mentorData.filter((e) => e.mentorName == req.body.mentorName && e.mentorQualification == req.body.mentorQualification && e.mentorId == req.body.mentorId)
    //     if (mentor.length == 0) {
    //         mentorData.push(req.body)
    //         res.status(201).send({
    //             message: 'New mentor created',
    //             data: req.body
    //         })
    //     }
    //     else {
    //         res.status(400).send({ message: 'Mentor with this data already exist' })
    //     }
    // }
    // else {
    //     res.status(400).send({
    //         message: 'Please enter mentorName, mentorQualification & mentorId'
    //     })
    // }
})

// getting all mentors info
app.get('/getAllMentor', (req, res) => {
    if (mentorData.length) {
        res.status(200).send({ mentorData })
    }
    else {
        res.status(404).send({ message: 'No mentor created yet !' })
    }
})

// creating new student
app.post('/createStudent', (req, res) => {
    if (req.body.studentName && req.body.batch && req.body.emailId && req.body.studentId) {
        let studentInfo = studentData.filter((e) => e.emailId === req.body.emailId)
        if (studentInfo.length == 0) {
            studentData.push(req.body)
            res.status(201).send({
                message: 'New student created',
                data: req.body
            })
        }
        else {
            res.status(400).send({ message: `Student with ${req.body.emailId} email id is already exist` })
        }
    }
    else {
        res.status(400).send({ message: 'Please enter studentName, batch, emailId, studentId' })
    }
})

// getting all students info
app.get('/getAllStudents', (req, res) => {
    if (studentData.length) {
        res.status(200).send({ studentData })
    }
    else {
        res.status(404).send({ message: 'No student created yet !' })
    }
})

// assigning student to mentor
app.post('/assigningStudent', (req, res) => {
    if (req.body.studentName && req.body.batch && req.body.mentorName && req.body.studentId && req.body.mentorId) {
        let assignedInfo = assigningStudent.filter((e) => e.studentId == req.body.studentId && e.mentorId == req.body.mentorId)
        if (assignedInfo.length == 0) {
            assigningStudent.push(req.body)
            res.status(201).send({
                message: 'student assigned to Mentor',
                data: assigningStudent
            })
        }
        else {
            res.status(400).send({ message: `student with student Id ${req.body.studentId} is already assigned to mentor with mentor Id ${req.body.mentorId}` })
        }
    }
    else {
        res.status(400).send({
            message: 'Please enter studentName, batch, mentorName, studentId, mentorId'
        })
    }
})

// getting students assigned to mentor
app.get('/getAssignedStudent', (req, res) => {
    if (assigningStudent.length) {
        res.status(200).send(assigningStudent)
    }
    else {
        res.status(404).send({ message: 'No student assigned to mentor' })
    }
})

// changing mentor assigned to student
app.put('/changeMentor/:id', (req, res) => {
    if (req.params.id < assigningStudent.length) {
        assigningStudent.splice(req.params.id, 1, req.body)
        res.status(200).send({
            message: "Mentor has changed"
        })
    }
    else {
        res.status(400).send({
            message: "Invalid Id"
        })
    }
})

app.listen(port, () => console.log(`App is listening to ${port}`))