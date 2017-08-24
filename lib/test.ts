import { Encoder, Decoder } from './encode-decode';
import QUnit = require('qunitjs');

QUnit.module('Encode');

QUnit.test('lo bit type', (assert) => {
  let encoded = Encoder.encode([1, 0, 0, 0], null) as number[];
  assert.deepEqual(encoded, [1]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 0);
});

QUnit.test('hi bit type', (assert) => {
  let encoded = Encoder.encode([255, 0, 0, 0], null) as number[];
  assert.deepEqual(encoded, [255]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 0);
});

QUnit.test('hi bit type overflow', (assert) => {
  assert.throws(() => Encoder.encode([256, 0, 0, 0], null), /Opcode type over 8-bits\. Got 256\./)
});

QUnit.test('lo bit type | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 0, 0], null) as number[];
  assert.deepEqual(encoded, [257, 1]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 1);
});

QUnit.test('hi bit type | hi bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 0, 0], null) as number[];
  assert.deepEqual(encoded, [511, 65535]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 1);
});

QUnit.test('hi bit type | hi bit operand overflow', (assert) => {
  assert.throws(() => {
    Encoder.encode([255, 65536, 0, 0], null)
  }, /Operand is over 16-bits\./);
});

QUnit.test('lo bit type | lo bit operand | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 1, 0], null) as number[];
  assert.deepEqual(encoded, [513, 1, 1]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 2);
});

QUnit.test('hi bit type | hi bit operand | hi bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 65535, 0], null) as number[];
  assert.deepEqual(encoded, [767, 65535, 65535]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 2);
});

QUnit.test('hi bit type | hi bit operand | hi bit operand overflow', (assert) => {
  assert.throws(() => Encoder.encode([255, 0, 65536, 0], null), /Operand is over 16-bits\./);
});

QUnit.test('lo bit type | lo bit operand | lo bit operand | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 1, 1], null) as number[];
  assert.deepEqual(encoded, [769, 1, 1, 1]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 3);
});

QUnit.test('hi bit type | hi bit operand | hi bit operand | hi bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 65535, 65535], null) as number[];
  assert.deepEqual(encoded, [1023, 65535, 65535, 65535]);
  assert.equal((encoded[0] & 0b0000111100000000) >> 8 , 3);
});

QUnit.test('hi bit type | hi bit operand overflow', (assert) => {
  assert.throws(() => {
    Encoder.encode([255, 0, 0, 65536], null)
  }, /Operand is over 16-bits\./);
});

QUnit.module('Encoding Hex');

QUnit.test('lo bit type', (assert) => {
  let encoded = Encoder.encode([1, 0, 0, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 1);
});

QUnit.test('hi bit type', (assert) => {
  let encoded = Encoder.encode([255, 0, 0, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 255);
});

QUnit.test('lo bit type | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 0, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 257);
  assert.equal(encoded.charCodeAt(1), 1);
});

QUnit.test('hi bit type | hi bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 0, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 511);
  assert.equal(encoded.charCodeAt(1), 65535);
});

QUnit.test('lo bit type | lo bit operand | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 1, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 513);
  assert.equal(encoded.charCodeAt(1), 1);
  assert.equal(encoded.charCodeAt(2), 1);
});

QUnit.test('hi bit type | hi bit operand | hi bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 65535, 0]) as string;
  assert.equal(encoded.charCodeAt(0), 767);
  assert.equal(encoded.charCodeAt(1), 65535);
  assert.equal(encoded.charCodeAt(2), 65535);
});

QUnit.test('lo bit type | lo bit operand | lo bit operand | lo bit operand', (assert) => {
  let encoded = Encoder.encode([1, 1, 1, 1]) as string;
  assert.equal(encoded.charCodeAt(0), 769);
  assert.equal(encoded.charCodeAt(1), 1);
  assert.equal(encoded.charCodeAt(2), 1);
  assert.equal(encoded.charCodeAt(3), 1);
});

QUnit.test('high bit type | high bit operand | high bit operand | high bit operand', (assert) => {
  let encoded = Encoder.encode([255, 65535, 65535, 65535]) as string;
  assert.equal(encoded.charCodeAt(0), 1023);
  assert.equal(encoded.charCodeAt(1), 65535);
  assert.equal(encoded.charCodeAt(2), 65535);
  assert.equal(encoded.charCodeAt(3), 65535);
});
