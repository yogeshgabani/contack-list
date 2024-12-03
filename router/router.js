const express = require('express');
const router = express.Router();
const { RegisterUser, ViewUser, LoginUser, UpdateUser, DeleteUser, UserAdmin, AddContact, DeleteContact, GetContact, UpdateContact, AdminView, UserContackList, UserContackAgg } = require('../controller/controller')
const { authMiddleware, RoleMiddleware } = require('../middleware/middleware')

router.post('/register', RegisterUser);

router.get('/view-user', ViewUser);

router.post('/login', LoginUser);

router.put('/update/:email', UpdateUser);

router.delete('/delete-contact/:email', DeleteUser);

router.get('/user/:email', UserAdmin);

// add contact list
router.post('/add-contact', authMiddleware ,AddContact);
// delete contact list
router.delete('/deletecontact/:id',authMiddleware, DeleteContact);
// get data by friend id
router.get('/getcontact/:id',authMiddleware, GetContact)
// ser update contact
router.put('/updatecontact/:id',authMiddleware, UpdateContact);
// admin login to get user list
router.post('/admin-view', authMiddleware, RoleMiddleware, AdminView);
// admin click user to get contact list of user with populate
router.get('/admin-view/user-list', UserContackList)
// admin click user to get contact list of user with aggregate
router.get('/admin-view/user-lists', UserContackAgg)


module.exports = router;