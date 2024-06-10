"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedUserBodyFromUserEntity = void 0;
function expectedUserBodyFromUserEntity(user) {
    const expectedAddress = Object.assign(Object.assign({}, user.address), { _id: expect.any(String) });
    const expectedUser = Object.assign(Object.assign({}, user), { _id: expect.any(String), address: expectedAddress, data_nascimento: user.data_nascimento.toISOString(), healthInfo: Object.assign(Object.assign({}, user.healthInfo), { _id: expect.any(String) }), password: expect.any(String), __v: expect.any(Number) });
    return { expectedAddress, expectedUser };
}
exports.expectedUserBodyFromUserEntity = expectedUserBodyFromUserEntity;
