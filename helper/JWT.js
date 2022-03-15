require("dotenv").config();
const jwt = require("jsonwebtoken"); // authentication & authorization

function JWTAuthToken(data) {
  if (data._id != null) {
    data.email = data._id;
  }
  delete data._id;

  return (token = jwt.sign({ ...data }, process.env.JWT_SECRET, {
    expiresIn: 6000,
  }));
}

function JWTVerify(token) {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      status: 200,
      decoded,
    };
  } catch (err) {
    return {
      status: 401,
      err,
    };
  }
}

async function AuthMiddleware(req, res, next) {
  // if(Object.keys(req.body).length==0)
  // {
  //     req.body=req.query;
  // }
  // const result = JWTVerify(req.body.token);
  // if (result.status !== 200) {
  //     res.status(401).send(JSON.stringify(result.err));
  // } else {
  //     res.locals.decoded = result.decoded;
  //     res.locals.newToken = JWTAuthToken({email:result.decoded.email})
  //     next();
  // }

  const authorizationHeader = req.headers["Authorization"];
  // 'Beaer [token]'
  const token = authorizationHeader?.split(" ")[1];
  if (!token) res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    next();
  });
}

module.exports = { JWTAuthToken, AuthMiddleware, JWTVerify };
