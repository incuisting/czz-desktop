import { client, errors } from 'jsmodbus';
import type { SocketConnectOpts } from 'net';
import { Socket } from 'net';

function handleErrors(err: any) {
  if (errors.isUserRequestError(err)) {
    switch (err.err) {
      case 'OutOfSync':
      case 'Protocol':
      case 'Timeout':
      case 'ManuallyCleared':
      case 'ModbusException':
      case 'Offline':
      case 'crcMismatch':
        console.log(
          `Error Message: ${err.message}`,
          `${'Error Modbus Error Type: '}${err.err}`,
        );
        break;
      default:
        break;
    }
  } else if (errors.isInternalException(err)) {
    console.log(
      `Error Message: ${err.message}`,
      `${'Error Error Name: '}${err.name}`,
      err.stack,
    );
  } else {
    console.log('Unknown Error', err);
  }
}
export const readCoils = (scope: { host: string; port: number }) => {
  const socket = new Socket();

  const options: SocketConnectOpts = {
    ...scope,
  };

  try {
    const mdClient = new client.TCP(socket);

    const readStart = 0;
    const readCount = 5;

    socket.on('connect', () => {
      mdClient
        .readCoils(readStart, readCount)
        .then(({ metrics, request, response }) => {
          console.log(`Transfer Time: ${metrics.transferTime}`);
          console.log(`Response Body Payload: ${response.body.valuesAsArray}`);
          console.log(
            `Response Body Payload As Buffer: ${response.body.valuesAsBuffer}`,
          );
        })
        .catch(handleErrors)
        .finally(() => socket.end());
    });

    socket.on('error', console.error);
    socket.connect(options);
  } catch (e) {
    console.log(e);
  }
};

export const writeSingleCoil = () => {};
