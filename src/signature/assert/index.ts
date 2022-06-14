import {Schema, SchemaValidator, schemas} from './src/index'
import BigNumber from "bignumber.js";
import {ethers} from "ethers";


export {schemas}
const HEX_REGEX = /^0x[0-9A-F]*$/i
export const assert = {
    isArray(variableName: string, value: any): void {
        if (!Array.isArray(value)) {
            throw new Error(assert.typeAssertionMessage(variableName, 'Array', value))
        }
    },
    isBigNumber(variableName: string, value: BigNumber): void {
        const isBigNumber = BigNumber.isBigNumber(value)
        assert.assert(isBigNumber, assert.typeAssertionMessage(variableName, 'BigNumber', value))
    },
    isNumber(variableName: string, value: number): void {
        assert.assert(Number.isFinite(value), assert.typeAssertionMessage(variableName, 'number', value))
    },
    isString(variableName: string, value: string): void {
        assert.assert(new String(value) instanceof String, assert.typeAssertionMessage(variableName, 'string', value))
    },
    isHexString(variableName: string, value: string): void {
        assert.assert(
            ethers.utils.isHexString(value) && HEX_REGEX.test(value),
            assert.typeAssertionMessage(variableName, 'HexString', value)
        )
    },
    isETHAddressHex(variableName: string, value: string): void {
        assert.assert(ethers.utils.isAddress(value), assert.typeAssertionMessage(variableName, 'string', value))
        // assert.assert(addressUtils.isAddress(value), assert.typeAssertionMessage(variableName, 'ETHAddressHex', value))
    },
    doesConformToSchema(variableName: string, value: any, schema: Schema, subSchemas?: Schema[]): void {
        if (value === undefined) {
            throw new Error(`${variableName} can't be undefined`)
        }
        const schemaValidator = new SchemaValidator()
        // if (subSchemas !== undefined) {
        //     _.map(subSchemas, schemaValidator.addSchema.bind(schemaValidator))
        // }
        const validationResult = schemaValidator.validate(value, schema)
        const hasValidationErrors = validationResult.errors.length > 0
        const msg = `Expected ${variableName} to conform to schema ${schema.id}
                  Encountered: ${JSON.stringify(value, null, '\t')}
                  Validation errors: ${validationResult.errors.join(', ')}`
        assert.assert(!hasValidationErrors, msg)
    },
    isBlockParam(variableName: string, value: any): void {
        if (Number.isInteger(value) && value >= 0) {
            return
        }
        if (value === 'earliest' || value === 'latest' || value === 'pending') {
            return
        }
        throw new Error(assert.typeAssertionMessage(variableName, 'BlockParam', value))
    },
    assert(condition: boolean, message: string): void {
        if (!condition) {
            throw new Error(message)
        }
    },
    typeAssertionMessage(variableName: string, type: string, value: any): string {
        return `Expected ${variableName} to be of type ${type}, encountered: ${value}`
    }
}
