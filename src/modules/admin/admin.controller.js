import pkg from 'bcrypt'
import { customAlphabet } from 'nanoid';
import { adminModel } from "../../../DB/models/adminModel.js";
import { sendEmailService } from "../../services/sendEmail.js";
import { generateToken, verifyToken } from '../../utils/tokenFunction.js';
import { isTempEmail } from './../../utils/blockTempEmailDomains.js';
const nanoId = customAlphabet('012345689', 4)

//TODO Uncomment Send Email Service
//========================================== signUp ============================================

export const adminSignUp = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    } = req.body
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    if (isTempEmail(email)) {
        return res.status(400).json({ message: 'Temporary email addresses are not allowed.' });
    }
    const isAdminDuplicate = await adminModel.findOne({ $or: [{ email }, { phoneNumber }] })
    if (isAdminDuplicate) {
        return next(new Error('Admin already registered with same email or phone', { cause: 409 }))
    }
    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)

    const verificationCode = nanoId();
    const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: { email },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn: '15m'
    });

    const adminObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified: false,
        verificationCode: hashedVerificationCode,
        role: 'admin'
    }
    const admin = await adminModel.create(adminObj)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: email,
    //         subject: 'Verification Email',
    //         message: `
    //         Here Is Your Verification Code :    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    //COOKIES set verificationToken in cookies
    res.status(200).json({ message: 'Check your gmail and verify your account', verificationToken: token, verificationCode, adminId: admin._id })
}

//========================================== verify account ==========================================

export const verifyEmail = async (req, res, next) => {
    const { verificationToken, verificationCode } = req.body
    const decoded = verifyToken({
        token: verificationToken,
        signature: process.env.CONFIRMATION_EMAIL_TOKEN
    })
    const admin = await adminModel.findOne(
        {
            $and:
                [
                    { $or: [{ role: 'admin' }, { role: 'editor' }, { role: 'customerService' }] },
                    { email: decoded?.email },
                    { isVerified: false }
                ]
        }
    )
    if (!admin) {
        return next(new Error('This account was verified before ', { cause: 400 }))
    }
    const isVerificationCodeMatch = pkg.compareSync(verificationCode, admin.verificationCode)
    if (!isVerificationCodeMatch) {
        return next(new Error('There is someThing Wrong in verification ', { cause: 400 }))
    }
    admin.isVerified = true
    admin.verificationCode = null
    await admin.save()
    // COOKIES clear verifictation token
    res.status(200).json({ message: 'Verification Done' })
}

//============================================ signIn ==============================================

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const existAdmin = await adminModel.findOne({ email })
    if (!existAdmin) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }
    const isPassMatch = pkg.compareSync(password, existAdmin.password)
    if (!isPassMatch) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }

    if (!existAdmin.isVerified) {
        const verificationCode = nanoId();
        const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
        const token = generateToken({
            payload: { email, verificationCode },
            signature: process.env.CONFIRMATION_EMAIL_TOKEN,
            expiresIn: '15m'
        });
        existAdmin.verificationCode = hashedVerificationCode;
        await existAdmin.save();

        // const isEmailSent = sendEmailService(
        //     {
        //         to: email,
        //         subject: 'Verification Email',
        //         message: `
        //         Here Is Your Verification Code :    ${verificationCode},
        //         `,
        //     })
        // if (! await isEmailSent) {
        //     return next(new Error('fail to send email', { cause: 400 }))
        // }
        //COOKIES set verificationToken in cookies
        return res.status(403).json({ message: 'Check you gmail and verify your account', verificationToken: token, adminId: existAdmin._id, verificationCode })
    }
    const adminToken = generateToken({
        payload: {
            email,
            _id: existAdmin._id,
        },
        signature: process.env.ADMIN_TOKEN_SIGNATURE,
        expiresIn: '7d'
    });
    const admin = await adminModel.findOneAndUpdate({ email }, { token: adminToken }, { new: true })
    if (!admin) {
        return next(new Error('failed to login', { cause: 400 }))
    }
    const response = {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role:admin.role,
        token: admin.token,
    }
    //COOKIES set refresh adminToken in cookies
    res.status(200).json({ message: 'Done', account: response })
}

//========================================== resend verification code ==========================================

export const resendVerificationCode = async (req, res, next) => {
    const { adminId } = req.params
    const admin = await adminModel.findOne({ _id: adminId })
    const verificationCode = nanoId();
    const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: admin.email,
    //         subject: 'Verification Email',
    //         message: `
    //         Your verification code is:    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    admin.verificationCode = hashedVerificationCode
    admin.save();
    res.status(200).json({ message: 'Done' })

}

//========================================== forget password ==========================================

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const admin = await adminModel.findOne({ email, role: 'admin' })
    if (!admin) {
        return next(new Error('invalid email', { cause: 400 }))
    }
    const code = nanoId()
    const hashedCode = pkg.hashSync(code, +process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: { email },
        signature: process.env.RESET_TOKEN,
        expiresIn: '15m'
    })
    // const isEmailSent = sendEmailService({
    //     to: email,
    //     subject: 'reset Password',
    //     message: `Your Reset code is : ${code}`
    // })

    // if (! await isEmailSent) {
    //     return next(new Error('failed to send  email', { cause: 400 }))
    // }
    await adminModel.findOneAndUpdate({ email }, { forgetCode: hashedCode }, { new: true })
    // if(!updatedAdmin){
    //     return next(new Error('failed t', { cause: 400 }))
    // }

    //COOKIES set verificationToken in cookies
    res.status(200).json({ message: 'Check you gmail to reset password', forgetToken: token, code })
}

//========================================== resend forget code ==========================================

export const resendForgetCode = async (req, res, next) => {
    const { adminId } = req.params
    const admin = await adminModel.findOne({ _id: adminId, role: 'admin' })
    const code = nanoId()
    const hashedCode = pkg.hashSync(code, +process.env.SALT_ROUNDS)
    // const isEmailSent = sendEmailService({
    //     to: email,
    //     subject: 'reset Password',
    //     message: `Your Reset code is : ${code}`
    // })

    // if (! await isEmailSent) {
    //     return next(new Error('failed to send  email', { cause: 400 }))
    // }
    admin.forgetCode = hashedCode
    admin.save();
    res.status(200).json({ message: 'Done' })

}

//========================================== reset password ==========================================

export const resetPassword = async (req, res, next) => {
    const { forgetToken, forgetCode, newPassword } = req.body
    if (!forgetToken || !forgetCode || !newPassword) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const decoded = verifyToken({ token: forgetToken, signature: process.env.RESET_TOKEN })
    const admin = await adminModel.findOne({
        email: decoded?.email,
        role: 'admin'
    })
    if (!admin) {
        return next(new Error('Invalid email', { cause: 400 }))
    }
    const isCodeMatch = pkg.compareSync(forgetCode, admin.forgetCode)
    if (!isCodeMatch) {
        return next(new Error('the code doesnot match', { cause: 400 }))
    }

    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)
    const changePasswordTime = Date.now()
    const resetedAdmin = await adminModel.findByIdAndUpdate(admin._id, { password: hashedPassword, forgetCode: null, changePasswordTime }, { new: true })
    const response = {
        adminId: resetedAdmin._id,
        firstName: resetedAdmin.firstName,
        lastName: resetedAdmin.lastName,
        email: resetedAdmin.email,
        phoneNumber: resetedAdmin.phoneNumber,
        token: resetedAdmin.token,
    }
    res.status(200).json({ message: 'Done', admin: response })

}

//========================================== change password =========================================

export const changePassword = async (req, res, next) => {
    const { _id } = req.authAdmin
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const admin = await adminModel.findById(_id)
    if (!admin) {
        return next(new Error('no admin', { cause: 401 }))
    }
    let oldPassMatch = pkg.compareSync(oldPassword, admin?.password)
    if (!oldPassMatch) {
        return next(new Error('wrong old password', { cause: 400 }))
    }
    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

    admin.password = hashedPassword
    const resetedAdmin = await admin.save()
    const response = {
        adminId: resetedAdmin._id,
        firstName: resetedAdmin.firstName,
        lastName: resetedAdmin.lastName,
        email: resetedAdmin.email,
        phoneNumber: resetedAdmin.phoneNumber,
        token: resetedAdmin.token,
    }
    res.status(200).json({ message: 'Done', admin: response })
}

//============================================== logOut ==============================================

export const logOut = async (req, res, next) => {
    //clear cookies
    // res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
}

//============================================== add account ==============================================

export const addAccount = async (req, res, next) => { 
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role
    } = req.body
    if (!firstName || !lastName || !email || !phoneNumber || !password || !role) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    if (role != 'customerService' && role != 'editor') {
        return next(new Error('please enter valid role', { cause: 400 }))
    }
    if (isTempEmail(email)) {
        return res.status(400).json({ message: 'Temporary email addresses are not allowed.' });
    }
    const isAccountDuplicate = await adminModel.findOne({ $or: [{ email }, { phoneNumber }] },)
    if (isAccountDuplicate) {
        return next(new Error('Account is already exist with same email or phone', { cause: 409 }))
    }
    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)

    // const verificationCode = nanoId();
    // const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    // const token = generateToken({
    //     payload: { email },
    //     signature: process.env.CONFIRMATION_EMAIL_TOKEN,
    //     expiresIn: '15m'
    // });

    const accountObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified: true,
        verificationCode: null,
        role
    }
    const admin = await adminModel.create(accountObj)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: email,
    //         subject: 'Verification Email',
    //         message: `
    //         Here Is Your Verification Code :    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    //COOKIES set verificationToken in cookies
    
    const response = {
        _id:admin._id,
        firstName:admin.firstName,
        lastName:admin.lastName,
        email:admin.email,
        phoneNumber:admin.phoneNumber,
        role:admin.role,
    }
    res.status(200).json({ message: 'Done', account:response})
}

//============================================== change account password ==============================================
// export const changeaccountPassword = async (req, res, next) => {
//     const { _id } = req.authAdmin
//     const {email, oldPassword, newPassword } = req.body
//     if (!oldPassword || !newPassword) {
//         return next(new Error('all fields are required', { cause: 400 }))
//     }
//     const admin = await adminModel.findById(_id)
//     if (!admin) {
//         return next(new Error('no admin', { cause: 401 }))
//     }
//     let oldPassMatch = pkg.compareSync(oldPassword, admin?.password)
//     if (!oldPassMatch) {
//         return next(new Error('wrong old password', { cause: 400 }))
//     }
//     const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

//     admin.password = hashedPassword
//     const resetedAdmin = await admin.save()
//     const response = {
//         adminId: resetedAdmin._id,
//         firstName: resetedAdmin.firstName,
//         lastName: resetedAdmin.lastName,
//         email: resetedAdmin.email,
//         phoneNumber: resetedAdmin.phoneNumber,
//         token: resetedAdmin.token,
//     }
//     res.status(200).json({ message: 'Done', admin: response })
// }

//============================================== delete account ==============================================

export const deleteAccount = async (req, res, next) => {
    const { email } = req.body
    if(!email){
        return next(new Error('Email is required', { cause: 400 }))
    }
    const deletedAccount = await adminModel.findOneAndDelete(
        {
            $and:
                [
                    { email },
                    { $or: [{ role:'editor' }, { role:'customerService' }] },
                ]
        }
    )
    if(!deletedAccount){
        return next(new Error('no account found with that email', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done'})

}

//============================================== change role ==============================================

export const changeRole = async (req,res,next) => {
    const {email, role} = req.body
    if(!email){
        return next(new Error('Email is required', { cause: 400 }))
    }
    if (role != 'customerService' && role != 'editor') {
        return next(new Error('please enter valid role', { cause: 400 }))
    }
    const updatedAccount = await adminModel.findOneAndUpdate(
        {
            $and:
                [
                    { email },
                    { $or: [{ role:'editor' }, { role:'customerService' }] },
                ]
        },
        {role},
        {new:true}
    )
    if(!updatedAccount) {
        return next(new Error('failed to change role', { cause: 400 }))
    }
    const response = {
        _id:updatedAccount._id,
        firstName:updatedAccount.firstName,
        lastName:updatedAccount.lastName,
        email:updatedAccount.email,
        phoneNumber:updatedAccount.phoneNumber,
        role:updatedAccount.role,
    }
    res.status(200).json({ message: 'Done', account:response})
}