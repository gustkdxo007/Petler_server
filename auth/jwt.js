// import jwt from "jsonwebtoken";

// // mutation
// login: (_, { email, age }) => {
//       const a = Users.filter((user) => {
//         return user.email === email;
//       });
//       if (!a[0]) {
//         return "가입된 사용자가 없습니다.";
//       }
//       if (a[0].age !== age) {
//         return "잘못된 비밀번호 입니다.";
//       }
//       const token = jwt.sign({ email, age }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       return token;
//     },
