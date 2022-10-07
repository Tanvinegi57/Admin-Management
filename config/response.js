var error_msg = {
	invalidToken: {
		message: "Your are unauthorized. Please login or create account to get access.",
		statusCode: 401,
		responseType: ""
	},
	InvalidPasswordToken: {
		message: "Invalid token.",
		statusCode: 400,
		responseType: ""
	},
	blockUser: {
		message: "Your account has been blocked. Please contact admin",
		statusCode: 400,
		responseType: ""
	},
	deleteUser: {
		message: "Your account has been deleted. Please contact admin",
		statusCode: 400,
		responseType: ""
	},
	//all fileds required
	filedRequired:{
		status: "failed", 
		message: "All fields are required" 
	},
	//unable to register
	unableRegister:{
		status: "failed", 
		message: "Unable to register"
	},
	//check
	alreadyExist: {
		message: "This Email is already registered with us.",
		statusCode: 400,
		responseType: ""
	},
	//check
	invalidStingTypeJoi:{
		message: "Invalid strings types",
		status: "failed"
	},
	userNotFound: {
		message: "User not found",
		statusCode: 400,
		responseType: ""
	},
	emailNotFound: {
		statusCode: 400,
		message: "Invalid credentials",
		responseType: ""
	},
	passwordNotMatch: {
		statusCode: 400,
		message: "Invalid Login credentials",
		responseType: ""
	},
	oldPasswordNotMatch: {
		statusCode: 400,
		message: "Old password is not valid.",
		responseType: ""
	},
	deletedAccount: {
		statusCode: 400,
		message: "Your account is deleted.",
		responseType: ""
	},
	emailAlreadyVerified: {
		statusCode: 400,
		message: "Email already verified.",
		responseType: "emailAlreadyVerified"
	},
	OLD_PASSWORD: {
		message: "Your old password is incorrect",
		responseType: "OLD_PASSWORD",
		statusCode: 400
	},
	OLD_NEW_PASSWORD: {
		message: "Your old password and new password is same please change to other password",
		responseType: "OLD_NEW_PASSWORD",
		statusCode: 400
	},
	recordNotFound: {
		statusCode: 400,
		message: "Record not found.",
		responseType: "RECORD_NOT_FOUND"
	},
	passwordRequired: {
		statusCode: 400,
		message: "Password is required.",
		responseType: ""
	}
};
var sendSuccess = function (data) {
	let success_msg = {
		"statusCode": 200,
		"message": data.message || "Success",
		"data": data.data,
	};
	return success_msg;
};
module.exports = {
	error_msg: error_msg,
	sendSuccess: sendSuccess,
}; 