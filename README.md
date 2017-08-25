# Encoder/Decoder

### Installing
```
yarn
```

### Running
```
yarn build
open index.html
```

### Testing
```
yarn test
```


## Layout: 16 bit aligned Uint16

First 16-Bit Integer is reserved for the opcode type a flag to indicate the number of operands.

| Unused |  Op Size |  Type  |
|--------|----------|--------|
| 4-bits |  4-bits  | 8-bits |

Depending on the op size there will be 0 - 3 operands that follow of which are 16-bit integrers.
