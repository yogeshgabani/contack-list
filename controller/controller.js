const { User } = require("../model/user");
const { contactlist } = require("../model/contact");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const jwtKey = "userlogin";


// Add Contact List

const RegisterUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const user = {
      name: req.body.name,
      number: [req.body.number],
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    };
    if (req.body.number1) {
      user.number.push(req.body.number1);
    }
    const existingUser = await User.findOne({ email: req.body.email });
    console.log("email ====>", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // bcrypt password
    let pass = req.body.password.toString();
    const hash = bcrypt.hashSync(pass, 10);

    const newUser = new User({ ...user, password: hash });
    console.log(newUser);
    const addData = await newUser.save();
    res.status(201).json({ message: "User registered successfully", addData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// view contact
const ViewUser = async (req, res) => {
  try {
    const Contact = await User.find();
    if (Contact.length > 0) {
      res.send(Contact);
    } else {
      res.send({ result: "no Contact found" });
    }
    console.log(Contact);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while getting contact", error });
  }
};

// login by user / admin
const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userdata = await User.findOne({ email });

    console.log("password", userdata.password);
    console.log("all data", userdata);
    if (!userdata) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordValid = await bcrypt.compare(password, userdata.password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    console.log(passwordValid);

    // Generate JWT Token
    const token = jwt.sign(
      { _id: userdata._id, email: userdata.email, password: userdata.password },
      jwtKey,
      { expiresIn: "5h" }
    );
    console.log(token);
    res.type("application/json");

    res.status(200).json({
      message: "Login successful",
      status: "success",
      statuscode: 200,
      success: true,
      Tokendata: {
        expiresIn: "1h",
        token,
      },
      userdata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// update contact
const UpdateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }
    res.status(200).json(updatedUser);
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while updating contact", error });
  }
};

// delete contact list
const DeleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    res.status(200).json({ message: "user deleted successfully", result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while delete contact", error });
  }
};

// find contact of admin
const UserAdmin = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.params.email });

    if (!result) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    if (result.role === "admin") {
      const allUsers = await User.find();
      return res.status(200).json(allUsers);
    } else {
      const user = await User.findOne({ email: req.params.email });
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

// add contact
const AddContact = async (req, res) => {
  console.log("userId", req.userId);
  console.log("body", req.body);

  const mobileNumber = req.body.mobile;
  console.log("mobile number -->", mobileNumber);

  try {
    const Existnumber = await User.findOne({ number: mobileNumber });
    console.log("exist contact -->", Existnumber);

    if (!Existnumber) {
      if (Existnumber === mobileNumber) {
        return res.status(400).json({
          message:
            "Mobile number is already associated with the logged-in user.",
        });
      }

      return res.status(400).json({ message: "Mobile number not registered" });
    }

    const addData = new contactlist({
      mobile: mobileNumber,
      userid: req.userId,
      friendid: Existnumber._id,
    });

    console.log("add new number", addData);
    const newData = await addData.save();
    res.status(201).json({ message: "User registered successfully", newData });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

// delete contact
const DeleteContact = async (req, res) => {
  try {
    const idmatch = req.params.id;
    const result = await contactlist.deleteOne({ _id: idmatch });
    console.log(result);
    res.status(200).json({ message: "contact deleted successfully", result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while delete contact", error });
  }
};

// get friend contact api
const GetContact = async (req, res) => {
  try {
    const result = await contactlist
      .findOne({ _id: req.params.id })
      .populate("friendid", "name country city -_id");
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "Requesting user not found" });
    }
    return res
      .status(404)
      .json({ message: "record fetch successfully", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

// user update contact
const UpdateContact = async (req, res) => {
  try {
    const id = req.params.id;
    const mobileNumber = req.body.mobile;
    const Existnumber = await User.findOne({ number: mobileNumber });
    console.log("exist contact -->", Existnumber);

    if (!Existnumber) {
      if (Existnumber === mobileNumber) {
        return res.status(400).json({
          message:
            "Mobile number is already associated with the logged-in user.",
        });
      }

      return res.status(400).json({ message: "Mobile number not registered" });
    }
    const updateContact = await contactlist.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );

    console.log("update contact", updateContact);
    res
      .status(404)
      .json({ message: "record updated successfully", updateContact });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

// view all contact by admin
const AdminView = async (req, res) => {
  try {
    const userdata = await User.find({ role: "user" }).select(
      "name email city state country"
    );
    res.status(200).send({
      message: "user data",
      name: userdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

// // user contact list view with populate
const UserContackList = async (req, res) => {
  try {
    const { id, mobile, city, country, limit, page } = req.body;
    let query = { userid: id };
    console.log("query", query);

    if (mobile) {
      query = {
        ...query,
        mobile: { $regex: new RegExp(mobile, "i") },
      };
    }
    if (city) {
      query = {
        ...query,
        'friendid.city': { $regex: new RegExp(city, "i") },
      };
    }

    console.log("Final query:", query);

    const userList = await contactlist.paginate(query, {
      page: page || 1,
      limit: limit || 10,
      populate: {
        path: "friendid",
        select: "name email city number state country",
      },
    });
    // .find({userid: id}).populate({path : 'friendid', select : 'name email city number state country'})
    console.log(userList);
    res.send(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

// user contact list view with aggregate
const UserContackAgg = async (req, res) => {
  try {
    const { id, mobile, city, country, limit = 10, page = 1 } = req.body;
    let query = { userid: id };
    console.log("query", query);

    if (mobile) {
      query = {
        ...query,
        mobile: { $regex: new RegExp(mobile, "i") },
      };
    }
    if (city) {
      query = {
        ...query,
        "friendid.city": { $regex: new RegExp(city, "i") },
      };
    }

    console.log("Final query:", query);

    const aggregateQuery = [
      {
        $match: { userid: id },
      },
      {
        $lookup: {
          from: "users",
          localField: "friendid",
          foreignField: "_id",
          as: "frienddata",
        },
      },
      {
        $unwind: { path: "$frienddata", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          mobile: 1,
          friendid: 1,
          "frienddata.name": 1,
          "frienddata.city": 1,
          "frienddata.country": 1,
        },
      },
      // {
      //   $skip: (page - 1) * limit,
      // },
      // {
      //   $limit: limit,
      // }
    ]

    const options = {
      page: 1,
      limit: 10,
    };
    // const userList = await contactlist.aggregate(aggregateQuery);
    const userList = await contactlist.aggregatePaginate(aggregateQuery, options);
    // .find({userid: id}).populate({path : 'friendid', select : 'name email city number state country'})
    console.log(userList);
    res.send(userList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching contact", error });
  }
};

module.exports = {
  RegisterUser,
  ViewUser,
  LoginUser,
  UpdateUser,
  DeleteUser,
  UserAdmin,
  AddContact,
  DeleteContact,
  GetContact,
  UpdateContact,
  AdminView,
  UserContackList,
  UserContackAgg
};
