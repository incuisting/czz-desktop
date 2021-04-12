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
export const readCoils = (
  scope: { host: string; port: number },
  coilValue: { start: number; count: number },
  cb: (result: any) => void,
  err: (error: any) => void,
) => {
  const socket = new Socket();

  const options: SocketConnectOpts = {
    ...scope,
  };

  try {
    const mdClient = new client.TCP(socket);

    socket.on('connect', () => {
      mdClient
        .readCoils(coilValue.start, coilValue.count)
        .then((value) => {
          const { metrics, response } = value;
          console.log(`Transfer Time: ${metrics.transferTime}`);
          console.log(`Response Body Payload: ${response.body.valuesAsArray}`);
          console.log(
            `Response Body Payload As Buffer: ${response.body.valuesAsBuffer}`,
          );
          cb(value);
        })
        .catch((...args) => {
          handleErrors(...args);
          err(...args);
        })
        .finally(() => socket.end());
    });

    socket.on('error', (...error) => {
      console.error(...error);
      err(...error);
  });
    socket.connect(options);
  } catch (e) {
    console.log(e);
  }
};

export const writeSingleCoil = (
  scope: { host: string; port: number },
  coilValue: { address: number; value: boolean | 0 | 1 },
  cb: (value: any) => void,
  err: (error: any) => void,
) => {
  const socket = new Socket();

  const options: SocketConnectOpts = {
    ...scope,
  };

  const mdClient = new client.TCP(socket);

  socket.on('connect', () => {
    mdClient
      .writeSingleCoil(coilValue.address, coilValue.value)
      .then((value) => {
        const { metrics, response } = value;
        console.log(`Transfer Time: ${metrics.transferTime}`);
        console.log(`Response Function Code: ${response.body.fc}`);
        cb(value);
      })
      .catch((...args) => {
        handleErrors(...args);
        err(...args);
      })
      .finally(() => socket.end());
  });

  socket.on('error', (...error) => {
    console.error(...error);
    err(...error)
  });
  socket.connect(options);
};
