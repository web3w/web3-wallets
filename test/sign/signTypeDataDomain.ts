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

    const types = [
        {name: 'name', type: 'string'},
        {name: 'version', type: 'string'},
        {name: 'chainId', type: 'uint256'},
        {name: 'verifyingContract', type: 'address'}
    ]

    // const typeDatas = Object.entries(DOMAIN_DEFAULT).map((val) => {
    //     const field = types.find(field=>field.name == val[0])
    //     console.log(field.type,val[1])
    // })

    const element = {
        "chainId": 4,
        "verifyingContract": "0x8D6022B8A421B08E9E4cEf45E46f1c83C85d402F",
        "name": "ElementEx",
        "version": "1.0.0"
    }
    //

    const elementHash =   getEIP712DomainHash(element)
    console.log(elementHash)

    const zeroV3hash = getEIP712DomainHash(DOMAIN_DEFAULT)
    //0xc92fa40dbe33b59738624b1b4ec40b30ff52e4da223f68018a7e0667ffc0e798
    console.log(zeroV3hash)

})()
