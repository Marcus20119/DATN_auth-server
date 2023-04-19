var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
import { isEmailValid } from '../helpers';

import db from '../models';
dotenv.config();

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

async function handleRefreshToken(clientData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem trong request có chứa refresh_token không
      if (!clientData.refresh_token) {
        return resolve({
          status: 401,
          payload: {
            message: 'refresh_token is needed',
          },
        });
      } else {
        jwt.verify(
          clientData.refresh_token,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, data) => {
            // Đoạn code này phải viết bên trong verify để lấy ra được id có trong accessKey
            const { refresh_token: userRefreshToken } =
              await db.RefreshToken.findOne({
                where: {
                  user_id: data.id,
                },
                raw: true,
              });
            // Kiểm tra xem refresh_token có trong refresh_token table của user không
            if (clientData.refresh_token !== userRefreshToken) {
              return resolve({
                status: 403,
                payload: {
                  message: 'refreshToken not found',
                },
              });
            }
            /**
             * Kiểm tra xem refresh_token này có chứa REFRESH_TOKEN_SECRET không
             * Nếu không thì trả lỗi
             * Nếu có thì trả về new access_token
             *  */
            if (err) {
              return resolve({
                status: 403,
                payload: {
                  message: 'Invalid refresh_token',
                },
              });
            }
            // trong data có iat và exp, 2 thông số này ta không cần thêm vào payload
            const new_access_token = jwt.sign(
              { email: data.email, id: data.id },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: '15s',
              }
            );
            return resolve({
              status: 200,
              payload: {
                message: 'Create new access_token successfully',
                new_access_token,
              },
            });
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}
async function createRefreshToken(user_id, payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      /**
       * Kiểm tra xem đã có user trong table refresh_tokens chưa
       * Nếu có thì cập nhật
       * Nếu không thì tạo mới
       *  */
      const user = await db.RefreshToken.findOne({
        attributes: { exclude: ['password'] },
        where: { user_id },
      });
      if (!user) {
        await db.RefreshToken.create({ refresh_token, user_id });
      } else {
        await db.RefreshToken.update(
          { refresh_token },
          {
            where: { user_id },
          }
        );
      }

      return resolve(refresh_token);
    } catch (err) {
      reject(err);
    }
  });
}

async function handleSignIn(signInData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email và password không
      if (!signInData.email || !signInData.password) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }
      const userInfo = await db.User.findOne({
        where: { email: signInData.email },
        raw: true,
      });
      // Kiểm tra có user không (Có nhập đúng email không)
      if (!userInfo) {
        return resolve({
          status: 404,
          payload: {
            message: 'Tài khoản không tồn tại',
          },
        });
      }
      // Kiểm tra có đúng mật khẩu không
      const isPasswordCorrect = bcrypt.compareSync(
        signInData.password,
        userInfo.password
      );
      if (!isPasswordCorrect) {
        return resolve({
          status: 400,
          payload: {
            message: 'Sai mật khẩu',
          },
        });
      }
      if (!userInfo.is_activated) {
        return resolve({
          status: 401,
          payload: {
            message: 'Chưa được Admin phê duyệt',
          },
        });
      }
      // Khi mọi thứ ok thì tạo refresh_token và access_token rồi trả dữ liệu về
      const { email, id, password, ...rest } = userInfo;
      const refresh_token = await createRefreshToken(id, { email, id });
      const access_token = jwt.sign(
        { email, id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '15s',
        }
      );
      return resolve({
        status: 200,
        payload: {
          message: '',
          userData: { email, id, ...rest },
          access_token,
          refresh_token,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function handleSignUp(signUpData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem có nhập email password, user_name và project_key không
      if (
        !signUpData.email ||
        !signUpData.password ||
        !signUpData.user_name ||
        !signUpData.project_key
      ) {
        return resolve({
          status: 422,
          payload: {
            message: 'Nhập thiếu dữ liệu',
          },
        });
      }
      // Check validate Email
      if (!isEmailValid(signUpData.email)) {
        return resolve({
          status: 422,
          payload: {
            message: 'Email không hợp lệ',
          },
        });
      }
      // Check validate password (Phải đúng 8 ký tự)
      if (signUpData.password.length !== 8) {
        return resolve({
          status: 422,
          payload: {
            message: 'Mật khẩu phải đúng 8 ký tự',
          },
        });
      }

      const isAlreadyExist = await db.User.findOne({
        where: { email: signUpData.email },
        attributes: { exclude: ['password'] },
        raw: true,
      });
      // Kiểm tra xem đã tồn tại User này chưa
      if (isAlreadyExist) {
        return resolve({
          status: 409,
          payload: {
            message: 'Tài khoản đã tồn tại',
          },
        });
      }

      const projectData = await db.Project.findOne({
        where: { project_key: signUpData.project_key },
        raw: true,
      });

      if (!projectData) {
        return resolve({
          status: 404,
          payload: {
            message: 'Không tồn tại dự án',
          },
        });
      }

      // Không có lỗi thì tạo user mới và lưu vào database
      const newUser = await db.User.build({
        ...signUpData,
        password: bcrypt.hashSync(signUpData.password, salt),
        role_id: 0,
        is_deleted: false,
        is_activated: false,
        project_id: projectData.id,
        project_key: projectData.project_key,
      });
      await newUser.save();

      // Khi mọi thứ ok thì tạo refresh_token và access_token rồi trả dữ liệu về
      // const userInfo = await db.User.findOne({
      //   where: { email: signUpData.email },
      //   attributes: { exclude: ['password'] },
      //   raw: true,
      // });
      // const { email, id, ...rest } = userInfo;
      // const refresh_token = await createRefreshToken(id, { email, id });
      // const access_token = jwt.sign(
      //   { email, id },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   {
      //     expiresIn: '60s',
      //   }
      // );

      return resolve({
        status: 200,
        payload: {
          message: 'Đăng ký thành công',
          // userData: { email, id, ...rest },
          // refresh_token,
          // access_token,
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}

export { handleSignIn, handleSignUp, handleRefreshToken };
