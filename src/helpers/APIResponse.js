const successResponse = (res, msg = "operation successful") => {
  const data = {
    status: 1,
    msg,
  };
  return res.status(200).json(data);
};

const successResponseWithData = (res, data, msg = "operation successful") => {
  const resData = {
    status: 1,
    msg,
    data,
  };
  return res.status(200).json(resData);
};

const errorResponse = (res, msg = "internal server error") => {
  const data = {
    status: 0,
    msg,
  };
  return res.status(500).json(data);
};

const notFoundResponse = (res, msg = "resource not found") => {
  const data = {
    status: 0,
    msg,
  };
  return res.status(404).json(data);
};

const validationError = (res, msg = "invalid data") => {
  const resData = {
    status: 0,
    msg,
  };
  return res.status(400).json(resData);
};

const validationErrorWithData = (res, data, msg = "invalid data") => {
  const resData = {
    status: 0,
    msg,
    data,
  };
  return res.status(400).json(resData);
};

const unauthorizedResponse = (res, msg = "unauthorized request") => {
  const data = {
    status: 0,
    msg,
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
