export async function createAWSResErr(statusCode: number, message: any) {
  Array.isArray(message)
    ? logErrors(message)
    : console.error(message);

  return {
    statusCode,
    body: JSON.stringify(message)
  };
}

function logErrors(errors: string[]) {
  console.error('Errors:');
  errors.forEach((element, i) => {
    console.error(`${i}) ${element}`);
  });
}
