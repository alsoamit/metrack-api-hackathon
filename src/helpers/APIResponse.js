const successResponse = (res, msg = "operation successful") => {
  var data = {
    status: 1,
    msg: msg,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, data, msg = "operation successful") => {
  var resData = {
    status: 1,
    msg: msg,
    data: data,
  };
  return res.status(200).json(resData);
};

const errorResponse = (res, msg = "internal server error") => {
  var data = {
    status: 0,
    msg: msg,
  };
  return res.status(500).json(data);
};

const notFoundResponse = (res, msg = "resource not found") => {
  var data = {
    status: 0,
    msg: msg,
  };
  return res.status(404).json(data);
};

const validationError = (res, msg = "invalid data") => {
  var resData = {
    status: 0,
    msg: msg,
  };
  return res.status(400).json(resData);
};

const validationErrorWithData = (res, data, msg = "invalid data") => {
  var resData = {
    status: 0,
    msg: msg,
    data: data,
  };
  return res.status(400).json(resData);
};

const unauthorizedResponse = (res, msg = "unauthorized request") => {
  var data = {
    status: 0,
    msg: msg,
  };
  return res.status(401).json(data);
};

export default {
  successResponse,
  successResponseWithData,
  errorResponse,
  notFoundResponse,
  validationErrorWithData,
  unauthorizedResponse,
  validationError,
};
