function createErrorResponse(errorCode: string, errorMessage: string) {
  return {
    error_code: errorCode,
    error_message: errorMessage,
  };
}

const successResponse = {
  status: 200,
};

export { createErrorResponse, successResponse };
