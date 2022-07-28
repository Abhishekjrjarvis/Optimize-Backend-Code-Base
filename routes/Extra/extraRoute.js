const express = require('express')
const router = express.Router()
const Extra = require('../../controllers/Extra/extraController')
const catchAsync = require('../../Utilities/catchAsync')

router.patch('/age/:uid', catchAsync(Extra.validateUserAge))

router.get('/age/:uid/get', catchAsync(Extra.retrieveAgeRestrict))

router.get('/random/query', catchAsync(Extra.retrieveRandomInstituteQuery))

router.get('/:uid/referral', catchAsync(Extra.retrieveReferralQuery))

router.post('/feedback/user', catchAsync(Extra.retrieveFeedBackUser))

router.get('/bonafide/certificate/:gr', catchAsync(Extra.retrieveBonafideGRNO))


module.exports = router