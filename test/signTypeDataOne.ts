
import {getEIP712DomainHash} from "../src/utils/eip712TypeData";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    //  // "ElementEx" //ZeroEx
    const DOMAIN_DEFAULT = {
        name: 'ZeroEx',
        chainId: "1",
        verifyingContract: '0x0000000000000000000000000000000000000000',
        version: '1.0.0',
    } ;

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
    //
    const hash = getEIP712DomainHash( DOMAIN_DEFAULT)
   //0x493057d29a99de3c54e9c3c3170cb9ba580fbb470639e84b1a47dae1a27ff48e
    console.log(hash)

})()
