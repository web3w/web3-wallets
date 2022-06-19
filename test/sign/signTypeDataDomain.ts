import {getEIP712DomainHash} from "../../src/signature/eip712TypeData";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
  //  // "ElementEx" //ZeroEx
    const DOMAIN_DEFAULT = {
        name: 'ZeroEx',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
        version: '1.0.0',
    };
    const zeroHash = getEIP712DomainHash(DOMAIN_DEFAULT)
    const zero = "0xc92fa40dbe33b59738624b1b4ec40b30ff52e4da223f68018a7e0667ffc0e798"
    console.log(zeroHash==zero)

})()
